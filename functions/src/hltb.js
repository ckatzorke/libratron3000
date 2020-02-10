const hltb = require('howlongtobeat')
const hltbService = new hltb.HowLongToBeatService()

const headers = {
  'Access-Control-Allow-Origin': 'https://libratron3000.katzorke.io'
}

/**
 * Lambda handler to search for a specific game. The search string must be in the event/request as query string parameter named 'search'
 */
exports.handler = (event, context, callback) => {
  let search = event.queryStringParameters.search
  if (search && search.trim() !== '') {
    hltbService.search(search).then(response => {
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(
          { result: response }
        )
      })
    }).catch(e => {
      callback(null, {
        statusCode: 503,
        headers,
        body: JSON.stringify(
          { e }
        )
      })
    })
  } else {
    callback(null, {
      statusCode: 400,
      headers
    })
  }
}
