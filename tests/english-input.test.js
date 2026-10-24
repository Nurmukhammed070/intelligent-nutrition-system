const test = require('node:test');
const assert = require('node:assert/strict');
const parser = require('../prototype/parser.js');
test('English food and gram amount', () => {
  const result = parser.parse('200 g rice');
  assert.equal(result.length, 1);
  assert.equal(result[0].food.name, 'Cooked rice');
  assert.equal(result[0].grams, 200);
});
test('English meal list with and separator', () => {
  const result = parser.parse('200 g rice and 2 eggs');
  assert.equal(result.length, 2);
  assert.equal(result[1].grams, 110);
});
