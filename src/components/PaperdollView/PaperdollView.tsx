import React from 'react'
import styles from './PaperdollView.module.css'
import PaperdollBam from './PaperdollBam'
import ColorTable from '../ColorTable/ColorTable'
import { Card } from '../Card/Card'

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
  const [skin, setSkin] = React.useState(16)
  const [hair, setHair] = React.useState(4)
  const [major, setMajor] = React.useState(44)
  const [minor, setMinor] = React.useState(55)
  const [armor, setArmor] = React.useState(28) // Armor/Trimming
  const [leather, setLeather] = React.useState(23) // Strap/Leather
  const [metal, setMetal] = React.useState(30) // Belt/Amulet
  const [paperdollDescriptor, setPaperdollDescriptor] = React.useState({
    gender: PaperdollGender.Male,
    race: PaperdollRace.Human,
    role: PaperdollRole.Priest,
    armor: PaperdollArmor.Heavy,
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

  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <PaperdollBam
          paperdollName={paperdollName}
          skin={skin}
          hair={hair}
          major={major}
          minor={minor}
          armor={armor}
          metal={metal}
          leather={leather}
        />
      </div>
      <div className={styles.selectors}>
        <select
          onChange={handleGender}
          value={paperdollDescriptor.gender}
          className={styles.select}
        >
          <option value={PaperdollGender.Male}>Male</option>
          <option value={PaperdollGender.Female}>Female</option>
        </select>
        <select
          onChange={handleRace}
          value={paperdollDescriptor.race}
          className={styles.select}
        >
          <option value={PaperdollRace.Human}>Human</option>
          <option value={PaperdollRace.Elf}>Elf</option>
          <option value={PaperdollRace.HalfElf}>Half-Elf</option>
          <option value={PaperdollRace.Gnome}>Gnome</option>
          <option value={PaperdollRace.Halfling}>Halfing</option>
          <option value={PaperdollRace.Dwarf}>Dwarf</option>
        </select>
        <select
          onChange={handleRole}
          value={paperdollDescriptor.role}
          className={styles.select}
        >
          <option value={PaperdollRole.Warrior}>Warrior</option>
          <option value={PaperdollRole.Priest}>Priest</option>
          <option value={PaperdollRole.Rogue}>Rogue</option>
          <option value={PaperdollRole.MagicUser}>Magic User</option>
        </select>
        <select
          onChange={handleArmor}
          value={paperdollDescriptor.armor}
          className={styles.select}
        >
          <option value={PaperdollArmor.None}>None</option>
          <option value={PaperdollArmor.Light}>Light</option>
          <option value={PaperdollArmor.Medium}>Medium</option>
          <option value={PaperdollArmor.Heavy}>Heavy</option>
        </select>
      </div>
      <div className={styles.colorsContainer}>
        <Card title="Skin">
          <ColorTable type="skin" selectedIndex={skin} onClick={setSkin} />
        </Card>
        <Card title="Hair">
          <ColorTable type="hair" selectedIndex={hair} onClick={setHair} />
        </Card>
        <Card title="Major">
          <ColorTable type="major" selectedIndex={major} onClick={setMajor} />
        </Card>
        <Card title="Minor">
          <ColorTable type="minor" selectedIndex={minor} onClick={setMinor} />
        </Card>
        <Card title="Armor">
          <ColorTable type="armor" selectedIndex={armor} onClick={setArmor} />
        </Card>
        <Card title="Leather">
          <ColorTable
            type="leather"
            selectedIndex={leather}
            onClick={setLeather}
          />
        </Card>
        <Card title="Metal">
          <ColorTable type="metal" selectedIndex={metal} onClick={setMetal} />
        </Card>
      </div>
    </div>
  )
}

export default PaperdollView
