import React from 'react'
import styles from './PaperdollView.module.css'
import PaperdollBam from './PaperdollBam'
import { AppearanceColorType } from '../../model/color'
import ColorPicker from '../ColorPicker/ColorPicker'
import { PaperdollColorDescriptor } from '../../model/paperdoll'

type PaperdollDescriptor = {
    gender: PaperdollGender
    race: PaperdollRace
    role: PaperdollRole
    armor: PaperdollArmor
}

function getPaperdollName(paperdollDescriptor: PaperdollDescriptor) {
    const { race, gender, role, armor } = paperdollDescriptor
    return `C${race}${gender}${role}${armor}INV.BAM`
}

enum PaperdollRace {
    Human = 'H',
    Elf = 'E',
    HalfElf = 'E',
    Gnome = 'D',
    Halfling = 'I',
    Dwarf = 'D',
}

enum PaperdollGender {
    Male = 'M',
    Female = 'F',
}

enum PaperdollRole {
    Warrior = 'F',
    Priest = 'C',
    Rogue = 'T',
    MagicUser = 'W',
}

enum PaperdollArmor {
    None = '1',
    Light = '2',
    Medium = '3',
    Heavy = '4',
}

export const PaperdollView: React.FC = () => {
    const [colorDescriptor, setColorDescriptor] = React.useState<PaperdollColorDescriptor>({
        skin: 16,
        hair: 4,
        major: 44,
        minor: 55,
        armor: 28,
        leather: 23,
        metal: 30,
    })

    const [paperdollDescriptor, setPaperdollDescriptor] = React.useState({
        gender: PaperdollGender.Male,
        race: PaperdollRace.Gnome,
        role: PaperdollRole.MagicUser,
        armor: PaperdollArmor.None,
    })

    const paperdollName = getPaperdollName(paperdollDescriptor)

    const handleGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaperdollDescriptor({
            ...paperdollDescriptor,
            gender: e.target.value as PaperdollGender,
        })
    }

    const handleRace = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaperdollDescriptor({
            ...paperdollDescriptor,
            race: e.target.value as PaperdollRace,
        })
    }

    const handleRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaperdollDescriptor({
            ...paperdollDescriptor,
            role: e.target.value as PaperdollRole,
        })
    }

    const handleArmor = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaperdollDescriptor({
            ...paperdollDescriptor,
            armor: e.target.value as PaperdollArmor,
        })
    }

    const handleColor = (slot: AppearanceColorType, colorIndex: number) => {
        setColorDescriptor({
            ...colorDescriptor,
            [slot]: colorIndex,
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.placeholder}>
                <div className={styles.colorPicker}>
                    <ColorPicker paperdollDescriptor={colorDescriptor} onChange={handleColor} />
                </div>
                <div className={styles.paperdoll}>
                    <PaperdollBam
                        paperdollName={paperdollName}
                        skin={colorDescriptor.skin}
                        hair={colorDescriptor.hair}
                        major={colorDescriptor.major}
                        minor={colorDescriptor.minor}
                        armor={colorDescriptor.armor}
                        metal={colorDescriptor.metal}
                        leather={colorDescriptor.leather}
                    />
                </div>
            </div>
            <div className={styles.selectors}>
                <select onChange={handleGender} value={paperdollDescriptor.gender} className={styles.select}>
                    <option value={PaperdollGender.Male}>Male</option>
                    <option value={PaperdollGender.Female}>Female</option>
                </select>
                <select onChange={handleRace} value={paperdollDescriptor.race} className={styles.select}>
                    <option value={PaperdollRace.Human}>Human</option>
                    <option value={PaperdollRace.Elf}>Elf</option>
                    <option value={PaperdollRace.HalfElf}>Half-Elf</option>
                    <option value={PaperdollRace.Gnome}>Gnome</option>
                    <option value={PaperdollRace.Halfling}>Halfing</option>
                    <option value={PaperdollRace.Dwarf}>Dwarf</option>
                </select>
                <select onChange={handleRole} value={paperdollDescriptor.role} className={styles.select}>
                    <option value={PaperdollRole.Warrior}>Warrior</option>
                    <option value={PaperdollRole.Priest}>Priest</option>
                    <option value={PaperdollRole.Rogue}>Rogue</option>
                    <option value={PaperdollRole.MagicUser}>Magic User</option>
                </select>
                <select onChange={handleArmor} value={paperdollDescriptor.armor} className={styles.select}>
                    <option value={PaperdollArmor.None}>None</option>
                    <option value={PaperdollArmor.Light}>Light</option>
                    <option value={PaperdollArmor.Medium}>Medium</option>
                    <option value={PaperdollArmor.Heavy}>Heavy</option>
                </select>
            </div>
        </div>
    )
}

export default PaperdollView
