const square = require('./string_square').value

test('insert a number', () => {
  var number = 123
  expect(square(number)).toBe(-1);
});