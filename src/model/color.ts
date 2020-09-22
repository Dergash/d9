export type ColorRGB = { red: number; green: number; blue: number }

export type Palette = ColorRGB[] | null

export type CharacterColor = {
    skin: Palette
    hair: Palette
    minor: Palette
    major: Palette
    metal: Palette
    leather: Palette
    armor: Palette
}

export type AppearanceColorType = keyof CharacterColor
