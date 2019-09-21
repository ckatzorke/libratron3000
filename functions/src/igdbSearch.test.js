let IGDBProxy = require('./igdbSearch').IgdbProxy

let client = new IGDBProxy('87f0156e4c5fb4876d7dd99ca4d01e88')
console.log(client.identifyGame('control'))
