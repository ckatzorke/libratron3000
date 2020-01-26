/**
 * Checks if the given cover image id is truesy and returns the proper image url for thumbnail size.
 * @param {string} cover an igdb image id for the cover
 */
export const coverBig = cover => {
  return igdbImageUrl('cover_big', cover)
}

/**
 * Checks if the given cover image id is truesy and returns the proper image url for thumbnail size.
 * @param {string} cover an igdb image id for the cover
 */
export const coverSmall = cover => {
  return igdbImageUrl('cover_small', cover)
}

/**
 * Checks if the given cover image id is truesy and returns the proper image url for thumbnail size.
 * @param {string} cover an igdb image id for the cover
 */
export const thumbnail = cover => {
  return igdbImageUrl('thumb', cover)
}

/**
 * Checks if the given cover image id is truesy and returns the proper image url for micro size.
 * @param {string} cover an igdb image id for the cover
 */
export const micro = cover => {
  return igdbImageUrl('micro', cover)
}

function igdbImageUrl(size, cover) {
  if (cover) {
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${cover}.png`
  }
  return '/assets/dummy.png'
}
