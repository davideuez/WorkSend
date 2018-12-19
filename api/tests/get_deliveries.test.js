const fetch = require("node-fetch");
const url = "https://worksend-develop.herokuapp.com/deliveries"

test('Get all deliveries for a specific assignment', async () => {
  expect.assertions(1)
  var response = await fetch(url + "/5c1918179b55c205c85eba61/all")
  expect(response.status).toEqual(200)
})

// test('Get a specific class', async () => {
//   expect.assertions(1)
//   var response = await fetch(url + "/5bf433d980f158000458c384")
//   expect(response.status).toEqual(200)
// })