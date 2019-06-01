const axios = require('axios')

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
  let limit = 5
  if (search && search.trim() !== '') {
    const client = new IgdbProxy(process.env.IGDB_API_KEY)
    client.searchGame(search, limit).then((response) => {
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(
          { result: response }
        )
      })
    }).catch((e) => {
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

class IgdbProxy {
  static get BASE_URL() { return 'https://api-v3.igdb.com' }

  /**
   * Constructor for IgdbProxy.
   * Previously in v2:
   * fields: [
        'id', 'name', 'slug', 'url', 'created_at', 'updated_at', 'summary', 'first_release_date',
        'release_dates', 'time_to_beat', 'cover', 'screenshots', 'videos', 'websites',
        'platforms.name', 'platforms.slug', 'platforms.url', 'platforms.logo',
        'platforms.created_at', 'platforms.updated_at', 'genres.name', 'genres.slug', 'genres.url',
        'genres.created_at', 'genres.updated_at'],
      expand: ['platforms', 'genres'],
   * @param {string} igdbApiKey the api key from idgb.com
   */
  constructor(igdbApiKey) {
    this.client = axios.create({
      queryMethod: 'url',
      method: 'post',
      baseURL: IgdbProxy.BASE_URL,
      headers: {
        Accept: 'application/json',
        'user-key': igdbApiKey,
        'Content-Type': 'text/plain'
      },
      responseType: 'json',
      timeout: 10000
    })
  }

  async getGameByName(name) {
    const response = await this.client.post('/games', `
            fields name, url, summary, updated_at, cover.image_id, platforms.abbreviation, platforms.name, platforms.slug, genres.name, first_release_date;
            limit 5;
            where name = "${name}";`)
    return response.data
  }

  async searchGame(searchString, limit = 10) {
    const response = await this.client.post('/search', `
            fields game.name, game.url, game.summary, game.updated_at, game.cover.image_id, game.platforms.abbreviation, game.platforms.name, game.platforms.slug, game.genres.name, game.first_release_date;
            limit ${limit};
            search "${searchString}"; where game != null;`)
    const result = []
    const igdb = response.data
    igdb.forEach((igdbEntry) => {
      if (igdbEntry.game) {
        result.push(igdbEntry.game)
      }
    })
    return result
  }
}
