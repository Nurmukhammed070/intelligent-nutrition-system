const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer, validatedItems } = require('../server/server.js');
test('rejects malformed model items and clamps confidence', () => {
  const r = validatedItems({ items: [{name:'Рис',grams:150,confidence:3,per100:{kcal:130,p:2.7,f:0.3,c:28}}, {name:'bad',grams:-5}] });
  assert.equal(r.length,1); assert.equal(r[0].confidence,1); assert.equal(r[0].estimated,true);
});
test('API health, food catalogue, text parser, and path security', async () => {
  const server = createServer(); await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  try {
    let r=await fetch(base+'/api/health'); assert.equal(r.status,200);
    r=await fetch(base+'/api/foods?q=buckwheat'); assert.equal(r.status,200); assert.ok((await r.json()).foods.length);
    r=await fetch(base+'/api/parse',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:'200 g buckwheat'})});
    const parsed=await r.json(); assert.equal(parsed.items[0].grams,200);
    r=await fetch(base+'/api/parse',{method:'POST',headers:{'content-type':'application/json'},body:'not JSON'}); assert.equal(r.status,400);
    r=await fetch(base+'/../README.md'); assert.notEqual(r.status,200);
  } finally { await new Promise(r=>server.close(r)); }
});
