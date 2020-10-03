let IGDBProxy = require('./igdbSearch').IgdbProxy

let client = new IGDBProxy(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
client.authenticate().then(() => {
  console.log('Looking for control')
  client.searchGame('control').then(data => {
    console.log(data)
  })
})
