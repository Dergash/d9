import React from 'react'
/* eslint import/no-webpack-loader-syntax: off */
import icon from '!arraybuffer-loader!../../assets/COLGRAD.BAM'
import BAMAdapter from '../../adapters/bam'
import Sprite from '../../model/sprite'
import Palette from '../../model/palette'
import palette from '!arraybuffer-loader!../../assets/MPALETTE.bmp'
import styles from './ColorTable.module.css'
import { AppearanceColorType } from '../../model/color'
import { useColorTable } from './useColorTable'
import cn from '../../utils/cn'

interface ColorTableProps {
    type?: AppearanceColorType | 'unlocked'
    colors?: number[]
    selectedIndex?: number
    className?: string
    onClick?: (index: number) => void
}

export const ColorTable: React.FC<ColorTableProps> = props => {
    const colors = useColorTable(props.type) ?? props.colors
    const dictionary = React.useMemo(() => {
        const colorsSrc: Record<number, string> = {}
        const adapter = new BAMAdapter()
        const bam = adapter.parse('COLGRAD', icon)
        const gradient = new Sprite(bam)
        const paletteParser = new Palette()
        const parsedPalette = paletteParser.parse(palette)
        colors?.forEach((item, index) => {
            gradient.colors.metal = parsedPalette[item]
            const src = gradient.getAsBase64()
            colorsSrc[item] = src
        })
        return colorsSrc
    }, [colors])

    const handleClick = React.useCallback(
        (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            const index = Number.parseInt(event.currentTarget.dataset.index ?? '', 10) ?? 0
            props.onClick?.(index)
        },
        [props.onClick]
    )

    return (
        <ul className={cn(props.className, styles.list)}>
            {colors?.map((item, index) => {
                return (
                    <li
                        key={item}
                        data-index={item}
                        className={cn(styles.item, {
                            [styles.selected]: props.selectedIndex === item,
                        })}
                        onClick={handleClick}
                    >
                        <img
                            src={dictionary[item]}
                            alt="Pick this color" // TODO color names
                            className={styles.img}
                        />
                    </li>
                )
            })}
        </ul>
    )
}

export default React.memo(ColorTable)
