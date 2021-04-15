const IgdbProxy = require('./igdbproxy')

const headers = {
  'Access-Control-Allow-Origin': '*'
}

/**
 * Gets screenshots as an array for a specific game id on IGDB
 * @param {number} the game id, as provided by IGDB
 * @returns {object}
 */
exports.handler = (event, context, callback) => {
  let gameid = event.queryStringParameters.id
  if (gameid && gameid.trim() !== '' && !isNaN(gameid)) {
    const client = new IgdbProxy(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    )
    client.authenticate().then(() => {
      client
        .getScreenshotsGameById(gameid)
        .then(response => {
          callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify({ result: response })
          })
        })
        .catch(e => {
          callback(null, {
            statusCode: 503,
            headers,
            body: JSON.stringify({ e })
          })
        })
    })
  } else {
    callback(null, {
      statusCode: 400,
      headers
    })
  }
}
