const fetch = require("node-fetch");
const url = "https://worksend-develop.herokuapp.com/classes"

test('works with get', async () => {
  expect.assertions(1)
  var response = await fetch(url)
  expect(response.status).toEqual(200)
})