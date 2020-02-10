let IGDBProxy = require('./igdbSearch').IgdbProxy

let client = new IGDBProxy(process.env.IGDB_API_KEY)
console.log(client.identifyGame('control'))
