const IgdbProxy = require('./igdbproxy')

let client = new IgdbProxy(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
client.authenticate().then(() => {
  client.searchGame('squadrons').then(data => {
    console.log(JSON.stringify(data))
  })
})
