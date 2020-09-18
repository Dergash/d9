import React from 'react'
/* eslint import/no-webpack-loader-syntax: off */
import colorIcon from '!arraybuffer-loader!./COLGRAD.BAM'
import palette from '!arraybuffer-loader!./MPALETTE.bmp'
import BAMAdapter from '../adapters/bam';
import Sprite from '../model/sprite';
import Palette from '../model/palette';

export const BamDemo: React.FC = () => {
    const [color, setColor] = React.useState(0)
    const adapter = new BAMAdapter();
    const bam = adapter.parse('COLGRAD', colorIcon);
    bam.decompressFrames();
    if (bam.frames.length > 1) {
        bam.combineFrames();
    }
    const gradient = new Sprite(bam);
    const paletteParser = new Palette()
    const parsedPalette = paletteParser.parse(palette)
    gradient.colors.metal = parsedPalette[color]
    const base64 = gradient.getAsBase64();
    return <div>
        <button onClick={() => setColor(color + 1)}>Next color: {color}</button>
        <img src={base64} />
    </div>
}

export default BamDemo
