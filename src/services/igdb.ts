function igdbImageUrl(size: string, imageId: string | undefined): string {
  if (imageId) {
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.png`
  }
  return '/assets/dummy.png'
}

export const coverBig = (imageId: string | undefined) => igdbImageUrl('cover_big', imageId)
export const coverSmall = (imageId: string | undefined) => igdbImageUrl('cover_small', imageId)
export const thumbnail = (imageId: string | undefined) => igdbImageUrl('thumb', imageId)
export const micro = (imageId: string | undefined) => igdbImageUrl('micro', imageId)
