export const platforms = [
  'PC',
  'PlayStation',
  'PlayStation 2',
  'PlayStation 3',
  'PlayStation 4',
  'PSP',
  'PlayStation Vita',
  'Nintendo 3DS',
  'Nintendo DS',
  'Nintendo Switch',
  'Wii',
  'Wii U',
  'Xbox 360',
  'Xbox One'
]

export const getIcon = (platform) => {
  const path = '/assets/platforms/'
  if (platform === 'Nintendo 3DS') {
    return path + '3ds.png'
  }
  if (platform === 'Nintendo DS') {
    return path + 'ds.jpg'
  }
  if (platform === 'PC') {
    return path + 'pc.png'
  }
  if (platform === 'PlayStation') {
    return path + 'ps.png'
  }
  if (platform === 'PlayStation 2') {
    return path + 'ps.png'
  }
  if (platform === 'PlayStation 3') {
    return path + 'ps.png'
  }
  if (platform === 'PlayStation 4') {
    return path + 'ps4.png'
  }
  if (platform === 'PSP') {
    return path + 'psp.png'
  }
  if (platform === 'PlayStation Vita') {
    return path + 'vita.png'
  }
  if (platform === 'Nintendo Switch') {
    return path + 'switch.png'
  }
  if (platform === 'Wii') {
    return path + 'wii.png'
  }
  if (platform === 'Wii U') {
    return path + 'wiiu.svg'
  }
  if (platform === 'Xbox 360') {
    return path + 'xbox.png'
  }
  if (platform === 'Xbox One') {
    return path + 'xone.png'
  }
}

export const shortPlatform = (platform) => {
  if (platform === 'Nintendo 3DS') {
    return '3DS'
  }
  if (platform === 'Nintendo DS') {
    return 'DS'
  }
  if (platform === 'PC') {
    return 'PC'
  }
  if (platform === 'PlayStation') {
    return 'PSX'
  }
  if (platform === 'PlayStation 2') {
    return 'PS2'
  }
  if (platform === 'PlayStation 3') {
    return 'PS3'
  }
  if (platform === 'PlayStation 4') {
    return 'PS4'
  }
  if (platform === 'PSP') {
    return 'PSP'
  }
  if (platform === 'PlayStation Vita') {
    return 'PSVITA'
  }
  if (platform === 'Nintendo Switch') {
    return 'Switch'
  }
  if (platform === 'Game Boy') {
    return 'GameBoy'
  }
  if (platform === 'Game Boy Advance') {
    return 'GBA'
  }
  if (platform === 'Wii') {
    return 'Wii'
  }
  if (platform === 'Wii U') {
    return 'WiiU'
  }
  if (platform === 'Xbox 360') {
    return 'Xbox360'
  }
  if (platform === 'Xbox One') {
    return 'XOne'
  }
}
