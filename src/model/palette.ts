import { CharacterColor, ColorRGB } from "./color";

const offsets = {
    metal: 0x04,
    minor: 0x10,
    major: 0x1c,
    skin: 0x28,
    leather: 0x34,
    armor: 0x40,
    hair: 0x4c,
    // shades
};
export default class Palette {
    setColors(palette: ColorRGB[], colors: CharacterColor) {
        const newPalette = [
            ...palette,
        ];
        Object.keys(colors).forEach((color) => {
            if (colors[color as keyof CharacterColor]) {
                for (let i = 0; i < 12; i++) {
                    // const pek = colors[color as keyof CharacterColor][i];
                   //  const bek = newPalette[offsets[color as keyof CharacterColor] + i]
                   newPalette[offsets[color as keyof CharacterColor] + i] = colors[color as keyof CharacterColor][i] as any;
                }
            }
        });


        return newPalette;
    }

    getTransparencyIndex(palette: ColorRGB[]) {
        for (let i = 0; i < palette.length; i++) {
            if (palette[i].red === 0 && palette[i].green === 255 && palette[i].blue === 0) {
                return i;
            }
        }
        return 0;
    }

    parse(data: ArrayBuffer) {
        const view = new DataView(data);
        const bmpRgbaOffset = view.getUint8(0x000a);
        const palette = [];
        let gradient = [];
        let shade = 0;
        for (let i = bmpRgbaOffset; i < data.byteLength; i = i + 3) {
            gradient.push({
                blue: view.getUint8(i + 2),
                green: view.getUint8(i + 1),
                red: view.getUint8(i),
            });
            if (gradient.length === 12) {
                palette.push(gradient);
                gradient = [];
            }
        }
        palette.reverse();
        return palette;
    }
}
