const fetch = require("node-fetch");
const url = "https://worksend.herokuapp.com/classes"

test('Get all classes', async () => {
  expect.assertions(1)
  var response = await fetch(url)
  expect(response.status).toEqual(200)
})

test('Get a specific class', async () => {
  expect.assertions(1)
  var response = await fetch(url + "/5bf433d980f158000458c384")
  expect(response.status).toEqual(200)
})