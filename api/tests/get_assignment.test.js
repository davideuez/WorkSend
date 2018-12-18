const fetch = require("node-fetch");
const url = "https://worksend.herokuapp.com/assignments"

test('Get all assignments', async () => {
  expect.assertions(1)
  var response = await fetch(url)
  expect(response.status).toEqual(200)
})

test('Get a specific assignment', async () => {
  expect.assertions(1)
  var response = await fetch(url + "/5c196c51e2d7780a6b1caf4f")
  expect(response.status).toEqual(200)
})

test('Get all assignments of a specific class', async () => {
  expect.assertions(1)
  var response = await fetch("https://worksend-develop.herokuapp.com/assignments/5bfd1f624aaa331862189391/all")
  expect(response.status).toEqual(200)
})