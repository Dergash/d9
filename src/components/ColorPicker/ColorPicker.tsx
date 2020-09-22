import React from 'react'
import Card from '../Card/Card'
import { AppearanceColorType } from '../../model/color'
import { ColorTable } from '../ColorTable/ColorTable'
import { PaperdollColorDescriptor } from '../../model/paperdoll'
import styles from './ColorPicker.module.css'
import cn from '../../utils/cn'
import left from '../../assets/controls/chevron_left-24px.svg'
import right from '../../assets/controls/chevron_right-24px.svg'

const slots: AppearanceColorType[] = ['skin', 'hair', 'major', 'minor', 'armor', 'leather', 'metal']

interface ColorPickerProps {
    paperdollDescriptor: PaperdollColorDescriptor
    onChange?: (slot: AppearanceColorType, colorIndex: number) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = props => {
    const [slot, setSlot] = React.useState(slots.indexOf('major'))
    const [lockColors, setLockColors] = React.useState(true)
    const selectedSlot = slots[slot]

    const handlePrev = () => {
        setSlot(slot - 1 >= 0 ? slot - 1 : slots.length - 1)
    }

    const handleNext = () => {
        setSlot(slot + 1 < slots.length ? slot + 1 : 0)
    }

    const handleChange = (colorIndex: number) => {
        props.onChange?.(selectedSlot, colorIndex)
    }

    const handleLockColors = () => {
        setLockColors(!lockColors)
    }

    return (
        <Card className={styles.container}>
            <header className={styles.header}>
                <button onClick={handlePrev} className={cn(styles.controls, styles.button)}>
                    <img src={left} alt="Previous color slot" className={styles.arrow} />
                </button>
                <div className={styles.title}>
                    <h2 className={styles.text}>{selectedSlot}</h2>
                    <button onClick={handleLockColors} className={cn(styles.button, styles.lock)}>
                        {lockColors && '🔒'}
                        {!lockColors && '🔓'}
                    </button>
                </div>
                <button onClick={handleNext} className={cn(styles.controls, styles.button)}>
                    <img src={right} alt="Next color slot" className={styles.arrow} />
                </button>
            </header>
            <ColorTable
                type={lockColors ? selectedSlot : 'unlocked'}
                className={styles.table}
                selectedIndex={props.paperdollDescriptor[selectedSlot]}
                onClick={handleChange}
            />
        </Card>
    )
}

export default React.memo(ColorPicker)
