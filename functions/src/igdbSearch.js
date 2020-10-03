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
  if (search && search.trim() !== '') {
    const client = new IgdbProxy(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    )
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
  } else {
    callback(null, {
      statusCode: 400,
      headers
    })
  }
}

class IgdbProxy {
  static get BASE_URL() {
    return 'https://api.igdb.com/v4'
  }

  /**
   * Constructor for IgdbProxy. You need to call #authenticate() first before usage.
   * @param {string} clientId the client_id from twitch developer program
   * @param {string} clientSecret the client_secret from twitch developer program
   */
  constructor(clientId, clientSecret) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async authenticate() {
    // authenticate
    try {
      const response = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`
      )
      // create default client
      this.accessToken = response.data.access_token
      console.log('Authenticated, setting accessToken')
      this.client = axios.create({
        queryMethod: 'url',
        method: 'post',
        baseURL: IgdbProxy.BASE_URL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${this.accessToken}`,
          'Client-ID': this.clientId
        },
        responseType: 'json',
        timeout: 10000
      })
    } catch (e) {
      console.log('err', e)
    }
  }

  async identifyGame(search) {
    let limit = 20
    // search for slug
    let slugResult = await this.getGameBySlug(search)
    if (slugResult.length === 1) {
      return slugResult
    }
    // if no unique slug, continue searching
    let searchResult = await this.searchGame(search, limit)
    return searchResult
  }

  async getGameByName(name) {
    const response = await this.client.post(
      '/games',
      `
            fields name, url, summary, updated_at, cover.image_id, platforms.abbreviation, platforms.name, platforms.slug, genres.name, first_release_date, involved_companies.developer, involved_companies.company.name;
            limit 5;
            where name = "${name}";`
    )
    return response.data
  }

  async getGameBySlug(slug) {
    const response = await this.client.post(
      '/games',
      `
            fields name, url, summary, updated_at, cover.image_id, platforms.abbreviation, platforms.name, platforms.slug, genres.name, first_release_date, involved_companies.developer, involved_companies.company.name;
            limit 1;
            where slug = "${slug.toLowerCase()}";`
    )
    return response.data
  }

  async searchGame(searchString, limit = 10) {
    const response = await this.client.post(
      '/search',
      `
            fields game.name, game.url, game.summary, game.updated_at, game.cover.image_id, game.platforms.abbreviation, game.platforms.name, game.platforms.slug, game.genres.name, game.first_release_date, game.involved_companies.developer, game.involved_companies.company.name;
            limit ${limit};
            search "${searchString}"; where game != null;`
    )
    const result = []
    const igdb = response.data
    igdb.forEach(igdbEntry => {
      if (igdbEntry.game && igdbEntry.game.name) {
        result.push(igdbEntry.game)
      }
    })
    return result
  }
}

exports.IgdbProxy = IgdbProxy
