const fetch = require("node-fetch");
const url = "http://localhost:3000/classes"

it('works with get', async () => {
  expect.assertions(1)
  var response = await fetch(url)
  expect(response.status).toEqual(200)
})