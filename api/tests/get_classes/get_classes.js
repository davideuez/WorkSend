const fetch = require("node-fetch");
const url = "https://worksend-develop.herokuapp.com"

async function get(url) {
  console.log('getting ' + url)
  const response = await fetch(url)
  const json = await response.json()
  console.log(json)
  return json
}

get(url + 'classes')