const fetch = require("node-fetch");
const url = "https://worksend-develop.herokuapp.com/api/v1/deliveries"

test('Get all deliveries for a specific assignment', async () => {
  expect.assertions(1)
  var response = await fetch(url + "/5c1918179b55c205c85eba61/all")
  expect(response.status).toEqual(200)
})