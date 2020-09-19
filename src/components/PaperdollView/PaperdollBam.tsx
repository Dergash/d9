import React from 'react'
import BAMAdapter from '../../adapters/bam'
import Sprite from '../../model/sprite'
import Palette from '../../model/palette'
import styles from './PaperdollBam.module.css'
/* eslint import/no-webpack-loader-syntax: off */
import palette from '!arraybuffer-loader!../../assets/MPALETTE.bmp'

interface PekProps {
    paperdollName: string
    skin: number
    hair: number
    major: number
    minor: number
    leather: number
    armor: number
    metal: number
}

export const PaperdollBam: React.FC<PekProps> = props => {
    const [sprite, setSprite] = React.useState<Sprite | undefined | null>()
    const p = React.useMemo(() => {
        const paletteParser = new Palette()
        const parsedPalette = paletteParser.parse(palette)
        return parsedPalette
    }, [])
    React.useEffect(() => {
        import(`!arraybuffer-loader!../../assets/${props.paperdollName}`)
            .then(bin => {
                const adapter = new BAMAdapter()
                const bam = adapter.parse('COLGRAD', bin.default)

                const gradient = new Sprite(bam)
                setSprite(gradient)
            })
            .catch(e => {
                console.error(e)
                setSprite(null)
            })
    }, [props.paperdollName])

    if (sprite) {
        sprite.colors.skin = p[props.skin]
        sprite.colors.hair = p[props.hair]
        sprite.colors.major = p[props.major]
        sprite.colors.minor = p[props.minor]
        sprite.colors.leather = p[props.leather]
        sprite.colors.armor = p[props.armor]
        sprite.colors.metal = p[props.metal]
        const base64 = sprite.getAsBase64()
        return <div>{sprite && <img src={base64} alt="Color icon" />}</div>
    }
    return (
        <div>
            {sprite === undefined && (
                <div className={styles.placeholder}>Loading...</div>
            )}
            {sprite === null && (
                <div className={styles.placeholder}>Not implemented</div>
            )}
        </div>
    )
}

export default React.memo(PaperdollBam)
