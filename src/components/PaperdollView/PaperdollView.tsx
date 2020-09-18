import React, { Suspense } from 'react'
import styles from './PaperdollView.module.css'

type PaperdollDescriptor = {
    gender: PaperdollGender,
    race: PaperdollRace,
    role: PaperdollRole,
    armor: PaperdollArmor
}

function getPaperdollName(paperdollDescriptor: PaperdollDescriptor) {
    const { race, gender, role, armor } = paperdollDescriptor
    return `C${race}${gender}${role}${armor}INV.BAM`
}

enum PaperdollRace {
    Human = 'H'
}

enum PaperdollGender {
    Male = 'M',
    Female = 'F'
}

enum PaperdollRole {
    Warrior = 'F',
    Priest = 'C',
    Rogue = 'T',
    MagicUser = 'W'
}

enum PaperdollArmor {
    None = '1',
    Light = '2',
    Medium = '3',
    Heavy = '4'
}

export const PaperdollView: React.FC = () => {
    const [skin, setSkin] = React.useState(12)
    const [hair, setHair] = React.useState(17)
    const [major, setMajor] = React.useState(44)
    const [minor, setMinor] = React.useState(55)
    const [paperdollDescriptor, setPaperdollDescriptor] = React.useState({
        gender: PaperdollGender.Male,
        race: PaperdollRace.Human,
        role: PaperdollRole.Rogue,
        armor: PaperdollArmor.None
    })

    const paperdollName = getPaperdollName(paperdollDescriptor)
    const OtherComponent = React.lazy(() => {
        return import('./PaperdollBam')
    })

    const handleSkin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSkin(skin + 1)
    }

    const handleHair = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setHair(hair + 1)
    }

    const handleMajor = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setMajor(major + 1)
    }

    const handleMinor = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setMinor(minor + 1)
    }

    const handleGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaperdollDescriptor({
            ...paperdollDescriptor,
            gender: e.target.value as PaperdollGender
        })
    }

    const handleRace = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaperdollDescriptor({
            ...paperdollDescriptor,
            race: e.target.value as PaperdollRace
        })
    }

    const handleRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaperdollDescriptor({
            ...paperdollDescriptor,
            role: e.target.value as PaperdollRole
        })
    }

    const handleArmor = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPaperdollDescriptor({
            ...paperdollDescriptor,
            armor: e.target.value as PaperdollArmor
        })
    }

    return <div className={styles.container}>
        <div className={styles.placeholder}>
            <Suspense fallback={<div>Loading...</div>}>
                <OtherComponent
                    paperdollName={paperdollName}
                    skin={skin}
                    hair={hair}
                    major={major}
                    minor={minor}
                />
            </Suspense>
        </div>
        <div>
            <select onChange={handleGender} value={paperdollDescriptor.gender}>
                <option value={PaperdollGender.Male}>
                    Male
                </option>
                <option value={PaperdollGender.Female}>
                    Female
                </option>
            </select>
            <select onChange={handleRace} value={paperdollDescriptor.race}>
                <option value={PaperdollRace.Human}>
                    Human
                </option>
                <option>Elf</option>
                <option>Half-elf</option>
                <option>Dwarf</option>
                <option>Gnome</option>
                <option>Halfling</option>
            </select>
            <select onChange={handleRole} value={paperdollDescriptor.role}>
                <option value={PaperdollRole.Warrior}>
                    Warrior
                </option>
                <option value={PaperdollRole.Priest}>
                    Priest
                </option>
                <option value={PaperdollRole.Rogue}>
                    Rogue
                </option>
                <option value={PaperdollRole.MagicUser}>
                    Magic User
                </option>
            </select>
            <select onChange={handleArmor} value={paperdollDescriptor.armor}>
                <option value={PaperdollArmor.None}>
                    None
                </option>
                <option value={PaperdollArmor.Light}>
                    Light
                </option>
                <option value={PaperdollArmor.Medium}>
                    Medium
                </option>
                <option value={PaperdollArmor.Heavy}>
                    Heavy
                </option>
            </select>
            <div>
                <button onClick={handleSkin}>Skin: {skin}</button>
                <button onClick={handleHair}>Hair: {hair}</button>
                <button onClick={handleMajor}>Major: {major}</button>
                <button onClick={handleMinor}>Minor: {minor}</button>
            </div>
        </div>
    </div>
}

export default PaperdollView
