"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { parse, FOODS } = require("../prototype/parser.js");
const PORT = Number(process.env.PORT) || 3000;
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL;
const ROOT = path.resolve(__dirname, "../prototype");
const MAX_JSON_BYTES = 5 * 1024 * 1024;
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon" };

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  res.end(JSON.stringify(data));
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    const parts = []; let length = 0; let stopped = false;
    req.on("data", chunk => {
      length += chunk.length;
      if (length > MAX_JSON_BYTES) {
        stopped = true;
        reject(Object.assign(new Error("Request too large"), { status: 413 }));
        req.pause();
        return;
      }
      parts.push(chunk);
    });
    req.on("end", () => {
      if (stopped) return;
      try { resolve(JSON.parse(Buffer.concat(parts).toString("utf8"))); }
      catch { reject(Object.assign(new Error("Invalid JSON"), { status: 400 })); }
    });
    req.on("error", reject);
  });
}
function validatedItems(value) {
  if (!value || !Array.isArray(value.items)) throw new Error("Unexpected model response");
  return value.items.slice(0, 12).filter(it => it && typeof it.name === "string" && it.name.trim().length && it.name.length < 120 && Number.isFinite(it.grams) && it.grams > 0 && it.grams <= 3000)
    .map(it => ({
      name: it.name.trim(), grams: Math.round(it.grams), confidence: Number.isFinite(it.confidence) ? Math.min(1, Math.max(0, it.confidence)) : null,
      per100: Object.fromEntries(["kcal", "p", "f", "c"].map(k => [k, Number.isFinite(it.per100?.[k]) && it.per100[k] >= 0 && it.per100[k] <= 1000 ? it.per100[k] : null])),
      estimated: true
    }));
}
async function recognize(payload) {
  if (!KEY || !MODEL) throw Object.assign(new Error("Recognition service is not configured"), { status: 503 });
  if (!payload || !["image/jpeg", "image/png", "image/webp"].includes(payload.mediaType) || typeof payload.image !== "string" || !/^[A-Za-z0-9+/]+={0,2}$/.test(payload.image) || payload.image.length > MAX_JSON_BYTES) {
    throw Object.assign(new Error("Valid JPEG, PNG, or WebP image required"), { status: 400 });
  }
  const prompt = `Identify foods shown in the image. The result is an approximate estimate, not a medical conclusion. Return only JSON in this shape: {"items":[{"name":"food name in English","grams":150,"confidence":0.5,"per100":{"kcal":120,"p":5,"f":3,"c":12}}]}. If there is no food, return {"items":[]}. Do not imply exact mass or ingredient identification from the photo; user confirmation is required.`;
  const abort = new AbortController(); const timer = setTimeout(() => abort.abort(), 25000);
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", signal: abort.signal,
      headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 1300, messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: payload.mediaType, data: payload.image } }, { type: "text", text: prompt }
      ] }] })
    });
    if (!response.ok) throw new Error("Vision provider returned HTTP " + response.status);
    const result = await response.json();
    const output = (result.content || []).filter(x => x.type === "text").map(x => x.text).join("\n");
    const match = output.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Vision provider did not return JSON");
    return { items: validatedItems(JSON.parse(match[0])), disclaimer: "Approximate AI estimate. Verify ingredients, weight, and nutritional values before saving." };
  } finally { clearTimeout(timer); }
}
function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    if (req.method === "GET" && url.pathname === "/api/health") return json(res, 200, { ok: true, photoRecognitionReady: Boolean(KEY && MODEL) });
    if (req.method === "GET" && url.pathname === "/api/foods") {
      const q = (url.searchParams.get("q") || "").trim().toLocaleLowerCase("ru-RU");
      if (q.length > 80) return json(res, 400, { error: "Search query is too long" });
      const foods = FOODS.filter(f => !q || (f.name.toLowerCase().includes(q) || f.stems.some(st => st.toLowerCase().includes(q)))).slice(0, 20).map(f => ({ name: f.name, kcal: f.kcal, p: f.p, f: f.f, c: f.c }));
      return json(res, 200, { foods, source: "Illustrative local food table — values require validation against an authoritative source" });
    }
    if (req.method === "POST" && (url.pathname === "/api/parse" || url.pathname === "/api/recognize")) {
      try {
        const payload = await readJson(req);
        if (url.pathname === "/api/parse") {
          if (!payload || typeof payload.text !== "string" || payload.text.length > 1000) return json(res, 400, { error: "Enter text up to 1,000 characters" });
          const items = parse(payload.text).slice(0, 15).map(x => ({ name: x.name, grams: x.grams, known: x.known, note: x.note, per100: x.food ? { kcal: x.food.kcal, p: x.food.p, f: x.food.f, c: x.food.c } : null }));
          return json(res, 200, { items, source: "Local food catalogue and rule-based parsing, without generative AI" });
        }
        return json(res, 200, await recognize(payload));
      } catch (e) { return json(res, e.status || 502, { error: e.status ? e.message : "Request processing error; check server settings and logs" }); }
    }
    if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { error: "Method not allowed" });
    let candidate;
    try { candidate = decodeURIComponent(url.pathname); } catch { return json(res, 400, { error: "Bad URL" }); }
    const file = path.resolve(ROOT, "." + (candidate === "/" ? "/index.html" : candidate));
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return json(res, 403, { error: "Forbidden" });
    fs.readFile(file, (error, buffer) => {
      if (error) return json(res, 404, { error: "Not found" });
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" });
      res.end(req.method === "HEAD" ? undefined : buffer);
    });
  });
}
if (require.main === module) createServer().listen(PORT, "127.0.0.1", () => console.log(`NutriSmart: http://localhost:${PORT} | AI photo configured: ${Boolean(KEY && MODEL)}`));
module.exports = { createServer, validatedItems };
