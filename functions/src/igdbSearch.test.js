const IgdbProxy = require('./igdbproxy')
const fs = require('fs')

let client = new IgdbProxy(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
fs.mkdirSync('./tmp', { recursive: true })
client.authenticate().then(() => {
  client.searchGame('squadrons').then(data => {
    writeresponse(data, 'search')
  })
  client.getGameById(134706).then(data => {
    writeresponse(data, 'byId')
  })
  client.getScreenshotsGameById(134706).then(data => {
    writeresponse(data, 'screenshots')
  })
})

function writeresponse(data, filename) {
  fs.writeFile(`./tmp/${filename}.json`, JSON.stringify(data, null, 2), (err) => {
    if (err) return console.log(err)
    console.log('response written to tmp/' + filename + '.json')
  })
}
