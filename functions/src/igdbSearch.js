const IgdbProxy = require('./igdbproxy')

const headers = {
  'Access-Control-Allow-Origin': '*'
}

/**
 * Searches for a game on IGDB
 * @param {string} search the search string to search for (from queryStringParameters)
 * @param {number} limit the number of max results, default is 5
 * @returns {object}
 */
exports.handler = (event, context, callback) => {
  let search = event.queryStringParameters.search
  if (search && search.trim() !== '') {
    const client = new IgdbProxy(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    )
    client.authenticate().then(() => {
      client
        .identifyGame(search)
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
