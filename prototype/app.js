(function () {
const $ = id => document.getElementById(id);
const P = NSParser;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];
const TITLES = { home: "Overview", diary: "Food diary", add: "Add food", insights: "Insights", goals: "Goals" };
const DEF_GOALS = { cal: 2000, p: 90, f: 65, c: 220 };

let goals = Object.assign({}, DEF_GOALS, ls.get("ns2_goals", {}));
let entries = ls.get("ns2_entries", []); // Start with a genuinely empty diary; no fabricated sample meals.
let diaryDate = today();
let draft = [];          // Application logic
let meal = autoMeal();
let photoRequest = null;
let photoGeneration = 0;

function autoMeal() { const h = new Date().getHours(); return h < 11 ? "Breakfast" : h < 16 ? "Lunch" : h < 21 ? "Dinner" : "Snack"; }
function seed() { const d = today(); return [
  { id: 1, date: d, name: "Oatmeal (water)", meal: "Breakfast", grams: 250, kcal: 88, p: 3, f: 1.7, c: 15, e: "🥣" },
  { id: 2, date: d, name: "Chicken egg", meal: "Breakfast", grams: 110, kcal: 157, p: 12.7, f: 11.5, c: .7, e: "🥚" }]; }
const per = (e) => { const k = e.grams / 100; return { kcal: e.kcal * k, p: e.p * k, f: e.f * k, c: e.c * k }; };
function sum(list) { return list.reduce((a, e) => { const n = per(e); a.kcal += n.kcal; a.p += n.p; a.f += n.f; a.c += n.c; return a; }, { kcal: 0, p: 0, f: 0, c: 0 }); }
const r0 = x => Math.round(x), r1 = x => Math.round(x * 10) / 10;
const save = () => ls.set("ns2_entries", entries);
function toast(m) { const t = $("toast"); t.textContent = m; t.style.display = "block"; clearTimeout(toast.t); toast.t = setTimeout(() => t.style.display = "none", 2600); }

/* ---------- navigation ---------- */
const NAV = [["home", "⌂", "Overview"], ["diary", "▤", "Food diary"], ["add", "＋", "Add"], ["insights", "✧", "Insights"], ["goals", "◉", "Goals"]];
$("sidenav").innerHTML = NAV.map(n => `<button data-p="${n[0]}">${n[1]} ${n[2]}</button>`).join("");
$("tabbar").innerHTML = NAV.map(n => `<button data-p="${n[0]}" class="${n[0] === "add" ? "fab" : ""}"><b>${n[1]}</b>${n[2]}</button>`).join("");
function go(p) {
  document.querySelectorAll(".page").forEach(x => x.classList.toggle("active", x.id === "p-" + p));
  document.querySelectorAll("[data-p]").forEach(x => x.classList.toggle("active", x.dataset.p === p));
  $("title").textContent = TITLES[p]; $("eyebrow").textContent = p === "add" ? "PHOTO OR TEXT" : "TODAY";
  render(); window.scrollTo(0, 0);
}
document.querySelectorAll("[data-p]").forEach(b => b.onclick = () => go(b.dataset.p));
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { go(b.dataset.go); if (b.dataset.act === "text") $("text").focus(); if (b.dataset.act === "photo") $("camBtn").scrollIntoView({ block: "center" }); });
$("date").textContent = new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long" });

/* ---------- overview / diary ---------- */
function rowHtml(e, del) { const n = per(e); return `<div class="row"><div class="emoji">${e.e || "🍽️"}</div><div class="grow"><b>${esc(e.name)}</b><small>${esc(e.meal)} · ${r0(e.grams)} g · P ${r0(n.p)} F ${r0(n.f)} C ${r0(n.c)}</small></div><b>${r0(n.kcal)} kcal</b>${del ? `<button class="del" data-del="${e.id}">✕</button>` : ""}</div>`; }
function render() {
  const td = entries.filter(e => e.date === today()), t = sum(td);
  const selected = entries.filter(e => e.date === diaryDate), selectedTotals = sum(selected);
  $("cal").textContent = r0(t.kcal).toLocaleString("en-US"); $("goalc").textContent = goals.cal;
  $("calbar").style.width = Math.min(100, t.kcal / goals.cal * 100) + "%";
  const left = goals.cal - r0(t.kcal); $("left").textContent = left >= 0 ? `Remaining: ${left} kcal` : `Above target by ${-left} kcal`;
  [["pro", "p", "probar", "proG"], ["fat", "f", "fatbar", "fatG"], ["carb", "c", "carbbar", "carbG"]].forEach(([id, k, bar, g]) => { $(id).textContent = r0(t[k]); $(bar).style.width = Math.min(100, t[k] / goals[k] * 100) + "%"; $(g).textContent = "goal " + goals[k] + " g"; });
  $("recent").innerHTML = td.length ? td.slice().reverse().slice(0, 5).map(e => rowHtml(e)).join("") : '<div class="empty">No entries yet. Tap “Photo meal” or “Type a meal”.</div>';
  // week
  const days = []; for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
  const key = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const vals = days.map(d => sum(entries.filter(e => e.date === key(d))).kcal), mx = Math.max(goals.cal, ...vals);
  $("bars").innerHTML = days.map((d, i) => `<div class="barbox"><div class="bar ${i === 6 ? "today" : ""}" style="height:${vals[i] / mx * 100}%"></div>${d.toLocaleDateString("en-US", { weekday: "short" })}</div>`).join("");
  // diary
  $("total").textContent = r0(selectedTotals.kcal) + " kcal"; $("totalmacro").textContent = `P ${r0(selectedTotals.p)} · F ${r0(selectedTotals.f)} · C ${r0(selectedTotals.c)} g`;
  $("diaryDate").value = diaryDate; $("diaryTotalLabel").textContent = diaryDate === today() ? "Today’s total" : "Selected day’s total";
  $("list").innerHTML = selected.length ? MEALS.map(m => { const l = selected.filter(e => e.meal === m); if (!l.length) return ""; return `<div class="mealhead">${m}<small>${r0(sum(l).kcal)} kcal</small></div><div class="card rows">${l.map(e => rowHtml(e, true)).join("")}</div>`; }).join("") : '<div class="card empty">No entries today.</div>';
  document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { entries = entries.filter(e => e.id !== +b.dataset.del); save(); render(); toast("Deleted"); });
  insights(t, td.length);
}
function insights(t, n) {
  const tips = [];
  if (!n) tips.push(["📝", "Start with one entry", "Add your first meal using a photo or text."]);
  else {
    if (t.kcal > goals.cal) tips.push(["ℹ️", "Above your calorie target", `Today: ${r0(t.kcal)} of ${goals.cal} kcal (rule CAL-01). This is informational.`]);
    if (t.p < goals.p * .6 && t.kcal > goals.cal * .4) tips.push(["💡", "Protein below selected goal", `Recorded: ${r0(t.p)} of ${goals.p} g (PRO-01). Options: eggs, cottage cheese, chicken, beans or tofu.`]);
    if (!tips.length) tips.push(["✅", "Within selected goals", "No flags in the current rule set."]);
  }
  const html = tips.map(x => `<div class="tip"><span>${x[0]}</span><div><b>${x[1]}</b><p class="muted">${x[2]}</p></div></div>`).join("") + '<small class="muted" style="display:block;margin-top:10px">Information only; not medical advice.</small>';
  $("nudge").innerHTML = html; $("insightList").innerHTML = "<h3>Today</h3>" + html;
}

/* ---------- diary dates and export ---------- */
$("diaryDate").addEventListener("change", e => { if (/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) { diaryDate = e.target.value; render(); } });
$("diaryToday").addEventListener("click", () => { diaryDate = today(); render(); });
$("exportCsv").addEventListener("click", () => {
  const columns = ["date","meal","name","grams","kcal_per_100g","protein_per_100g","fat_per_100g","carbs_per_100g","portion_kcal","portion_protein","portion_fat","portion_carbs"];
  const quote = v => '"' + String(v ?? "").replace(/"/g,'""') + '"';
  const rows = entries.filter(e => e.date === diaryDate).map(e => {
    const n = per(e); return [e.date,e.meal,e.name,e.grams,e.kcal,e.p,e.f,e.c,r1(n.kcal),r1(n.p),r1(n.f),r1(n.c)];
  });
  const csv = '\ufeff' + [columns,...rows].map(row => row.map(quote).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download="nutrismart-"+diaryDate+".csv";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast("Diary CSV exported for " + diaryDate);
});

/* Search the same food data used by the nutrition parser. This is illustrative
   reference data, not a validated national food composition database. */
let foodSearchTimer;
$("foodSearch").addEventListener("input", () => {
  clearTimeout(foodSearchTimer);
  const q = $("foodSearch").value.trim();
  if (q.length < 2) { $("foodMatches").innerHTML = q ? '<div class="search-note">Enter at least 2 letters.</div>' : ''; return; }
  foodSearchTimer = setTimeout(async () => {
    try {
      const response = await fetch("/api/foods?q=" + encodeURIComponent(q));
      if (!response.ok) throw new Error("Could not search catalogue");
      const data = await response.json();
      $("foodMatches").innerHTML = data.foods.length ? data.foods.map((food, i) =>
        `<button type="button" class="search-result" data-food-index="${i}"><span><b>${esc(food.name)}</b><small>Protein ${r1(food.p)} g · Fat ${r1(food.f)} g · Carbs ${r1(food.c)} g / 100 g</small></span><b>${r0(food.kcal)} kcal</b></button>`
      ).join("") : '<div class="search-note">No matching food. Try text input or manual entry.</div>';
      $("foodMatches").onclick = event => {
        const b = event.target.closest("[data-food-index]"); if (!b) return;
        const food = data.foods[Number(b.dataset.foodIndex)]; if (!food) return;
        draft.push({ name: food.name, grams: 100, food: { kcal: food.kcal, p: food.p, f: food.f, c: food.c, e: "🍽️" }, src: "db", note: "Illustrative catalogue data — verify values on the product label" });
        drawDraft(); $("foodSearch").value = ""; $("foodMatches").innerHTML = "";
        $("review").scrollIntoView({ behavior: "smooth", block: "start" });
      };
    } catch (error) {
      // The clickable prototype also works when opened directly as file://.
      const matches = (window.FOODS || []).filter(food =>
        (food.name + " " + (food.stems || []).join(" ")).toLowerCase().includes(q.toLowerCase())).slice(0,12);
      $("foodMatches").innerHTML = matches.length ? matches.map((food,i) =>
        `<button type="button" class="search-result" data-offline-index="${i}"><span><b>${esc(food.name)}</b><small>Protein ${r1(food.p)} g · Fat ${r1(food.f)} g · Carbs ${r1(food.c)} g / 100 g</small></span><b>${r0(food.kcal)} kcal</b></button>`).join("") : '<div class="search-note">No matching food in the illustrative catalogue.</div>';
      $("foodMatches").onclick = event => {
        const b = event.target.closest("[data-offline-index]"); if(!b)return;
        const food=matches[+b.dataset.offlineIndex];if(!food)return;
        draft.push({name:food.name,grams:100,food:{kcal:food.kcal,p:food.p,f:food.f,c:food.c,e:food.e},src:"db",note:"Illustrative nutrition values — verify using product packaging"});
        drawDraft();$("foodSearch").value="";$("foodMatches").innerHTML="";
      };
    }
  }, 180);
});

/* ---------- add entry ---------- */
const EXAMPLES = ["200 g buckwheat and 150 g chicken breast", "2 eggs, 2 slices bread, coffee", "banana, 150 g cottage cheese", "a bowl of borscht"];
$("examples").innerHTML = EXAMPLES.map(x => `<button class="chip" type="button">${esc(x)}</button>`).join("");
$("examples").onclick = e => { if (e.target.classList.contains("chip")) { $("text").value = e.target.textContent; fromText(); } };
let tt; $("text").oninput = () => { clearTimeout(tt); tt = setTimeout(fromText, 450); };
function fromText() {
  const v = $("text").value.trim(); if (!v) { draft = []; return drawDraft(); }
  draft = P.parse(v).map(toItem); drawDraft();
}
function toItem(x) { return { name: x.name, grams: x.grams || 100, food: x.food ? { kcal: x.food.kcal, p: x.food.p, f: x.food.f, c: x.food.c, e: x.food.e } : null, src: x.known ? "db" : "none", note: x.note || (x.known ? "" : "Food not found — enter nutritional values per 100 g"), custom: x.known ? null : { kcal: "", p: "", f: "", c: "" } }; }
const cur = it => it.food || { kcal: +it.custom.kcal || 0, p: +it.custom.p || 0, f: +it.custom.f || 0, c: +it.custom.c || 0 };
function drawDraft() {
  $("review").hidden = !draft.length;
  $("items").innerHTML = draft.map((it, i) => { const f = cur(it), k = it.grams / 100;
    return `<div class="item" data-i="${i}"><div class="itop"><div class="emoji">${(it.food && it.food.e) || "🍽️"}</div><div class="iname"><b>${esc(it.name)}</b><small>${r0(f.kcal * k)} kcal · P ${r0(f.p * k)} F ${r0(f.f * k)} C ${r0(f.c * k)}</small></div><button class="x" data-rm="${i}" aria-label="Remove">✕</button></div>
    <div class="step"><button data-m="${i}">−</button><input type="number" inputmode="decimal" value="${it.grams}" data-g="${i}" aria-label="grams"><span>g</span><button data-pl="${i}">+</button></div>
    ${it.src === "ai" ? '<div class="ai">✧ AI photo estimate — verify the portion</div>' : ""}${it.note ? `<div class="warn">⚠ ${esc(it.note)}</div>` : ""}
    ${it.custom ? `<div class="custom"><input type="number" inputmode="decimal" placeholder="kcal" data-c="${i}.kcal" value="${it.custom.kcal}"><input type="number" inputmode="decimal" placeholder="P" data-c="${i}.p" value="${it.custom.p}"><input type="number" inputmode="decimal" placeholder="F" data-c="${i}.f" value="${it.custom.f}"><input type="number" inputmode="decimal" placeholder="C" data-c="${i}.c" value="${it.custom.c}"></div>` : ""}</div>`; }).join("");
  $("meals").innerHTML = MEALS.map(m => `<button class="chip ${m === meal ? "on" : ""}" data-meal="${m}">${m}</button>`).join("");
  totals();
}
function totals() { const t = sum(draft.map(it => Object.assign({ grams: it.grams }, cur(it)))); $("rTotal").textContent = r0(t.kcal) + " kcal"; $("rMacro").textContent = `P ${r0(t.p)} · F ${r0(t.f)} · C ${r0(t.c)} g`; }
function refreshItem(i) { const it = draft[i], f = cur(it), k = it.grams / 100, el = document.querySelector(`.item[data-i="${i}"] .iname small`); if (el) el.textContent = `${r0(f.kcal * k)} kcal · P ${r0(f.p * k)} F ${r0(f.f * k)} C ${r0(f.c * k)}`; totals(); }
$("items").onclick = e => { const t = e.target, step = g => g < 50 ? 5 : 10;
  if (t.dataset.rm !== undefined) { draft.splice(+t.dataset.rm, 1); drawDraft(); }
  else if (t.dataset.m !== undefined) { const it = draft[+t.dataset.m]; it.grams = Math.max(5, it.grams - step(it.grams)); drawDraft(); }
  else if (t.dataset.pl !== undefined) { const it = draft[+t.dataset.pl]; it.grams += step(it.grams); drawDraft(); } };
$("items").oninput = e => { const t = e.target;
  if (t.dataset.g !== undefined) { draft[+t.dataset.g].grams = Math.max(0, +t.value || 0); refreshItem(+t.dataset.g); }
  else if (t.dataset.c) { const [i, k] = t.dataset.c.split("."); draft[+i].custom[k] = t.value; refreshItem(+i); } };
$("meals").onclick = e => { if (e.target.dataset.meal) { meal = e.target.dataset.meal; drawDraft(); } };
$("saveBtn").onclick = () => {
  const bad = draft.find(it => !(it.grams > 0 && it.grams <= 3000) || (it.custom && (!["kcal", "p", "f", "c"].every(k => it.custom[k] !== "" && Number.isFinite(+it.custom[k]) && +it.custom[k] >= 0 && +it.custom[k] <= 1000))));
  if (!draft.length) return;
  if (bad) return toast(!(bad.grams > 0) ? "Enter portion size" : "Enter valid non-negative kcal and macro values for “" + bad.name + "”");
  draft.forEach((it, i) => { const f = cur(it); entries.push({ id: Date.now() + i, date: today(), name: it.name, meal, grams: it.grams, kcal: f.kcal, p: f.p, f: f.f, c: f.c, e: (it.food && it.food.e) || "🍽️" }); });
  save(); draft = []; $("text").value = ""; clearSelectedPhoto(false); drawDraft(); toast("Saved to food diary ✓"); go("diary");
};
$("mAdd").onclick = () => { const n = $("mName").value.trim(), g = +$("mG").value; if (!n || !(g > 0 && g <= 3000) || ["mK", "mP", "mF", "mC"].some(k => $(k).value === "" || !Number.isFinite(+$(k).value) || +$(k).value < 0 || +$(k).value > 1000)) return toast("Enter a valid name, portion, calories and macros");
  draft.push({ name: n, grams: g, food: { kcal: +$("mK").value, p: +$("mP").value || 0, f: +$("mF").value || 0, c: +$("mC").value || 0, e: "🍽️" }, src: "manual", note: "Values entered manually — check against a reliable source" }); drawDraft(); ["mName", "mK", "mP", "mF", "mC"].forEach(x => $(x).value = ""); };

/* ---------- photo ---------- */
function clearSelectedPhoto(showNotice = true) {
  photoGeneration++;
  if (photoRequest) { photoRequest.abort(); photoRequest = null; }
  $("photoState").hidden = true;
  $("preview").removeAttribute("src");
  $("photoMsg").textContent = "";
  $("photoCam").value = "";
  $("photoGal").value = "";
  // Only discard suggestions generated from the removed photo.
  draft = draft.filter(it => it.src !== "ai");
  drawDraft();
  if (showNotice) toast("Photo removed. You can select another image.");
}
$("clearPhoto").addEventListener("click", () => clearSelectedPhoto());
function shrink(file, max = 1024) { return new Promise((res, rej) => { const img = new Image(), u = URL.createObjectURL(file);
  img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL("image/jpeg", .82)); };
  img.onerror = () => rej(new Error("bad image")); img.src = u; }); }
async function onPhoto(e) {
  const f = e.target.files[0]; e.target.value = ""; if (!f || !f.type.startsWith("image/")) return;
  clearSelectedPhoto(false);
  const generation = ++photoGeneration;
  const controller = new AbortController();
  photoRequest = controller;
  $("photoState").hidden = false; $("photoMsg").innerHTML = '<span class="spin"></span>Analyzing photo…';
  let url; try { url = await shrink(f); } catch (err) { if (generation === photoGeneration) $("photoMsg").textContent = "Could not open the photo."; return; }
  if (generation !== photoGeneration) return;
  $("preview").src = url;
  try {
    const r = await fetch("/api/recognize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: url.split(",")[1], mediaType: "image/jpeg" }), signal: controller.signal });
    if (!r.ok) throw new Error(r.status === 503 ? "off" : "fail");
    const { items } = await r.json();
    if (generation !== photoGeneration) return;
    if (!items.length) { $("photoMsg").textContent = "No food found in the photo. Try again or type a meal."; return; }
    draft = items.map(it => { const m = P.findFood(it.name), pr = it.per100 || {};
      return { name: m ? m.name : it.name, grams: r0(it.grams), src: "ai", note: it.confidence < .5 ? "Low confidence — please verify" : "",
        food: m ? { kcal: m.kcal, p: m.p, f: m.f, c: m.c, e: m.e } : { kcal: +pr.kcal || 0, p: +pr.p || 0, f: +pr.f || 0, c: +pr.c || 0, e: "🍽️" } }; });
    $("photoMsg").innerHTML = `Found: <b>${draft.length}</b>. Verify the portions below.`; drawDraft(); $("review").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    if (generation !== photoGeneration || err.name === "AbortError") return;
    $("photoMsg").innerHTML = err.message === "off" ? "Photo recognition is not configured (server API key required). <b>Describe the meal in text</b> to calculate nutrition." : "Photo recognition failed. <b>Type the meal instead</b>.";
    $("text").focus();
  } finally { if (generation === photoGeneration) photoRequest = null; }
}
$("photoCam").onchange = onPhoto; $("photoGal").onchange = onPhoto;

/* ---------- goals ---------- */
function fillGoals() { $("goalcal").value = goals.cal; $("goalpro").value = goals.p; $("goalfat").value = goals.f; $("goalcarb").value = goals.c; }
$("saveGoals").onclick = () => { goals = { cal: +$("goalcal").value || DEF_GOALS.cal, p: +$("goalpro").value || DEF_GOALS.p, f: +$("goalfat").value || DEF_GOALS.f, c: +$("goalcarb").value || DEF_GOALS.c }; ls.set("ns2_goals", goals); render(); toast("Goals saved"); };
$("reset").onclick = () => { if (confirm("Delete all entries and goals?")) { try { localStorage.removeItem("ns2_entries"); localStorage.removeItem("ns2_goals"); } catch (e) {} entries = []; goals = Object.assign({}, DEF_GOALS); fillGoals(); render(); toast("Reset complete"); } };
fillGoals(); drawDraft(); render();
})();
