import BAMTexture from '../adapters/bam-texture'
import Palette from './palette'
import { CharacterColor } from './color'

export default class Sprite {
    BAMTexture: BAMTexture
    colors: CharacterColor = {
        hair: null,
        skin: null,
        major: null,
        minor: null,
        armor: null,
        leather: null,
        metal: null,
    }

    constructor(BAMTexture: BAMTexture) {
        this.BAMTexture = BAMTexture
    }

    getAsBase64() {
        const PaletteHelper = new Palette()
        let palette = [...this.BAMTexture.palette]
        const { width, height, data } = this.BAMTexture.frames[0]
        const transparencyIndex = PaletteHelper.getTransparencyIndex(palette)
        palette = PaletteHelper.setColors(palette, this.colors)

        const pixels = new Uint8Array(data as ArrayBuffer)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d') as CanvasRenderingContext2D // TODO : Create canvas every time is dumb
        const imgData = context.createImageData(width, height)

        for (let i = 0; i < pixels.length; i++) {
            if (!palette[pixels[i]]) {
                console.warn(i)
                console.warn(palette)
                console.warn(pixels)
            }
            imgData.data[i * 4 + 0] = palette[pixels[i]]?.blue // TODO: 'Dward warrior heavy' references index 255 and crashes with out of range
            imgData.data[i * 4 + 1] = palette[pixels[i]]?.green
            imgData.data[i * 4 + 2] = palette[pixels[i]]?.red
            imgData.data[i * 4 + 3] = pixels[i] === transparencyIndex ? 0 : 255
        }

        context.putImageData(imgData, 0, 0)
        const result = canvas.toDataURL('image/png')
        return result
    }
}
