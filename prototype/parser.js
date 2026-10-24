/* Parse meal text such as "200 g rice and 2 eggs" into food entries with portion sizes and nutrients. */
(function (root) {
  const FOODS = (typeof module !== "undefined" && module.exports) ? require("./foods.js") : root.FOODS;
  const norm = s => s.toLowerCase().replace(/ё/g, "е");
  const NUMW = { "один": 1, "одна": 1, "одно": 1, "одну": 1, "два": 2, "две": 2, "три": 3, "четыре": 4, "пять": 5, "шесть": 6, "семь": 7, "восемь": 8, "девять": 9, "десять": 10, "пол": 0.5, "половина": 0.5, "половину": 0.5, "полтора": 1.5, "one": 1, "two": 2, "three": 3, "four": 4, "half": 0.5 };
  // единицы: множитель к граммам (null = штуки/порции)
  const UNITS = [
    [/^(kg|kilogram\w*|кг|килограмм\w*)$/, 1000], [/^(g|gram\w*|г|гр|грамм\w*)$/, 1], [/^(ml|milliliter\w*|мл|миллилитр\w*)$/, 1], [/^(liter\w*|litre\w*|л|литр\w*)$/, 1000],
    [/^(ст\.?л\.?|столов\w*)$/, 15], [/^(ч\.?л\.?|чайн\w*)$/, 5], [/^(стакан\w*)$/, 200], [/^(кружк\w*|чашк\w*)$/, 250],
    [/^(pcs?|pieces?|eggs?|шт\.?|штук\w*|штуки|штуку)$/, null], [/^(кусок|куска|кусков|кусочек|кусочка|ломтик\w*|долька|дольки|долек)$/, null],
    [/^(serving\w*|portion\w*|bowl\w*|порци\w*|тарелк\w*|миск\w*)$/, "portion"],
  ];
  const DEFAULT_PORTION = 150;

  function findFood(seg) {
    let best = null, bestLen = 0;
    const text = " " + norm(seg).replace(/[^а-яa-z0-9 ]/g, " ").replace(/\s+/g, " ") + " ";
    for (const f of FOODS) for (const st of f.stems) {
      const s = norm(st);
      const needle = " " + s;
      if (text.includes(needle) && s.length > bestLen) { best = f; bestLen = s.length; }
    }
    return best;
  }

  function parseSegment(seg) {
    seg = seg.trim();
    if (!seg) return null;
    const lower = norm(seg);
    const tokens = lower.replace(/(\d)([а-яa-z])/g, "$1 $2").replace(/([а-яa-z])(\d)/g, "$1 $2").split(/\s+/);
    let qty = null, unit = null, usedIdx = new Set();
    for (let i = 0; i < tokens.length; i++) {
      let t = tokens[i].replace(",", ".");
      let n = /^\d+(\.\d+)?$/.test(t) ? parseFloat(t) : (NUMW[t] !== undefined ? NUMW[t] : null);
      if (n === null) continue;
      usedIdx.add(i);
      const nx = (tokens[i + 1] || "").replace(/\.$/, "");
      let u = null;
      for (const [re, m] of UNITS) if (re.test(nx)) { u = m; usedIdx.add(i + 1); break; }
      if (u === null && qty === null) { qty = n; unit = "count"; if (UNITS.some(([re, m]) => re.test(nx) && m === null)) unit = "count"; }
      else if (qty === null) { qty = n; unit = u; }
      break;
    }
    // «по х» без числа: «стакан молока»
    if (qty === null) for (let i = 0; i < tokens.length; i++) for (const [re, m] of UNITS) if (re.test(tokens[i]) && m !== null) { qty = 1; unit = m; }
    const food = findFood(seg);
    const name = tokens.filter((_, i) => !usedIdx.has(i)).join(" ").trim() || seg;
    let grams = null, note = "";
    if (food) {
      if (qty === null) { grams = food.piece || DEFAULT_PORTION; note = "Default portion — confirm the weight"; }
      else if (unit === "count" || unit === null) { grams = qty * (food.piece || DEFAULT_PORTION); if (!food.piece) note = "Piece weight unknown — confirm the portion"; }
      else if (unit === "portion") { grams = qty * 250; note = "Portion estimated at 250 g — confirm the weight"; }
      else grams = qty * unit;
    } else if (qty !== null && typeof unit === "number") grams = qty * unit;
    return { raw: seg, name: food ? food.name : name, food, grams: grams === null ? null : Math.round(grams), note, known: !!food };
  }

  function parse(text) {
    return norm(text || "").split(/(?<!\d),(?!\d)|[;\n+]|\sи\s|\sс\s|\sплюс\s|\sand\s|\swith\s|\splus\s/).map(parseSegment).filter(Boolean);
  }

  function nutrients(item) {
    const f = item.food || item.custom || { kcal: 0, p: 0, f: 0, c: 0 };
    const k = (item.grams || 0) / 100;
    return { kcal: f.kcal * k, p: f.p * k, f: f.f * k, c: f.c * k };
  }
  const api = { parse, parseSegment, findFood, nutrients, FOODS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.NSParser = api;
})(typeof self !== "undefined" ? self : this);
