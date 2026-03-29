export const platforms = [
  'PC',
  'Itch.io',
  'Steam',
  'Gog',
  'Epic',
  'PlayStation',
  'PlayStation 2',
  'PlayStation 3',
  'PlayStation 4',
  'PlayStation 5',
  'PSP',
  'PlayStation Vita',
  'Nintendo 3DS',
  'Nintendo DS',
  'Nintendo Switch',
  'Game Boy',
  'Game Boy Advance',
  'Wii',
  'Wii U',
  'Xbox 360',
  'Xbox One',
  'Xbox Series X'
]

export function getIcon(platform: string): string {
  const path = '/assets/platforms/'
  const map: Record<string, string> = {
    'Nintendo 3DS': '3ds.png',
    'Nintendo DS': 'ds.jpg',
    'PC': 'pc.png',
    'PlayStation': 'ps.png',
    'PlayStation 2': 'ps.png',
    'PlayStation 3': 'ps.png',
    'PlayStation 4': 'ps4.png',
    'PSP': 'psp.png',
    'PlayStation Vita': 'vita.png',
    'Nintendo Switch': 'switch.png',
    'Wii': 'wii.png',
    'Wii U': 'wiiu.svg',
    'Xbox 360': 'xbox.png',
    'Xbox One': 'xone.png',
    'Xbox Series X': 'xone.png'
  }
  return map[platform] ? path + map[platform] : ''
}

export function shortPlatform(platform: string | undefined): string {
  if (!platform) return ''
  const map: Record<string, string> = {
    'Nintendo 3DS': '3DS',
    'Nintendo DS': 'DS',
    'PC': 'PC',
    'Itch.io': 'Itch.io',
    'Steam': 'Steam',
    'Gog': 'Gog',
    'Epic': 'Epic',
    'PlayStation': 'PSX',
    'PlayStation 2': 'PS2',
    'PlayStation 3': 'PS3',
    'PlayStation 4': 'PS4',
    'PlayStation 5': 'PS5',
    'PSP': 'PSP',
    'PlayStation Vita': 'PSVITA',
    'Nintendo Switch': 'Switch',
    'Game Boy': 'GameBoy',
    'Game Boy Advance': 'GBA',
    'Wii': 'Wii',
    'Wii U': 'WiiU',
    'Xbox 360': 'Xbox360',
    'Xbox One': 'XOne',
    'Xbox Series X': 'XSeX'
  }
  return map[platform] ?? platform
}
