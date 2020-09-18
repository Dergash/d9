import React from 'react'
import BAMAdapter from '../../adapters/bam';
import Sprite from '../../model/sprite';
import Palette from '../../model/palette';
import styles from './PaperdollBam.module.css'
/* eslint import/no-webpack-loader-syntax: off */
import palette from '!arraybuffer-loader!../../assets/MPALETTE.bmp'

interface PekProps {
    paperdollName: string,
    skin: number,
    hair: number,
    major: number,
    minor: number
}

export const PaperdollBam: React.FC<PekProps> = (props) => {
    const [src, setSrc] = React.useState<string | undefined | null>(undefined)
    import(`!arraybuffer-loader!../../assets/${props.paperdollName}`)
        .then((bin) => {
            const adapter = new BAMAdapter();
            const bam = adapter.parse('COLGRAD', bin.default);
            bam.decompressFrames();
            if (bam.frames.length > 1) {
                bam.combineFrames();
            }
            const gradient = new Sprite(bam);
            const paletteParser = new Palette()
            const parsedPalette = paletteParser.parse(palette)
            gradient.colors.skin = parsedPalette[props.skin]
            gradient.colors.hair = parsedPalette[props.hair]
            gradient.colors.major = parsedPalette[props.major]
            gradient.colors.minor = parsedPalette[props.minor]
            gradient.colors.leather = parsedPalette[4]
            const base64 = gradient.getAsBase64();
            setSrc(base64)
        })
        .catch((e) => {
            console.error(e)
            setSrc(null)
        })
    return <div>
        {src && <img src={src} alt="Color icon" />}
        {src === undefined && <div className={styles.placeholder}>Loading...</div>}
        {src === null && <div className={styles.placeholder}>Not implemented</div>}
    </div>
}

export default PaperdollBam
