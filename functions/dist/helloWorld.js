exports.handler = function(event, context, callback) {
  let name = 'World'
  if (event.queryStringParameters.name) {
    name = event.queryStringParameters.name
  }
  callback(null, {
    statusCode: 200,
    body: 'Hello, ' + name
  })
}
