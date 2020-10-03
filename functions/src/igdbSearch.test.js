let IGDBProxy = require('./igdbSearch').IgdbProxy

let client = new IGDBProxy(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
client.authenticate().then(() => {
  client.searchGame('squadrons').then(data => {
    console.log(JSON.stringify(data))
  })
})
