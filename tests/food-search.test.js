"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("../server/server.js");
let server, base;
test.before(async () => { server = createServer(); await new Promise(resolve => server.listen(0, "127.0.0.1", resolve)); base = `http://127.0.0.1:${server.address().port}`; });
test.after(async () => { await new Promise(resolve => server.close(resolve)); });
test("catalogue search supplies macros without manual input", async () => {
  const r = await fetch(`${base}/api/foods?q=rice`); assert.equal(r.status, 200);
  const data = await r.json(); assert.ok(data.foods.length);
  assert.ok(data.foods.some(f => typeof f.kcal === "number" && typeof f.p === "number" && typeof f.f === "number" && typeof f.c === "number"));
});
test("invalid null parse payload returns 400 rather than 502", async () => {
  const r = await fetch(`${base}/api/parse`, { method:"POST", headers:{"content-type":"application/json"}, body:"null" });
  assert.equal(r.status, 400);
});
test("HTML includes touch-friendly food search", async () => {
  const r = await fetch(base); const html = await r.text(); assert.ok(html.includes('id="foodSearch"')); assert.ok(html.includes('id="foodMatches"'));
});
