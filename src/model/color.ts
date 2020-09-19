export type ColorRGB = { red: number; green: number; blue: number }

export type Palette = ColorRGB[]

export type CharacterColor = {
    skin: any
    hair: any
    minor: any
    major: any
    metal: any
    leather: any
    armor: any
}

export type AppearanceColorType = keyof CharacterColor
