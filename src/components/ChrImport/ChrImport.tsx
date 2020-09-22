import React from 'react'
import {ChrEntity} from '../../entities/chr'
import styles from './ChrImport.module.css'
export const ChrImport: React.FC = () => {
    const [entity, setEntity] = React.useState<ChrEntity | undefined>()
    const uploader = React.useRef<HTMLInputElement>(null)
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        const file = files?.[0]
        const reader = new FileReader()
        reader.onloadend = (ev) => {
            const buffer = reader.result as ArrayBuffer
            const entity = ChrEntity.parse(buffer)
            setEntity(entity)
        }
        if (file) {
            reader.readAsArrayBuffer(file as File)
        }
    }

    const handleClick = () => {
        uploader.current?.click()
    }

    return <div className={styles.container}>
        <label>
            <input
                type="file"
                ref={uploader}
                className={styles.input}
                onChange={handleChange}
            />
            <button className={styles.button} onClick={handleClick}>
                Import Character
            </button>
        </label>
        <span className={styles.name}>
            { entity?.getName() }
        </span>
    </div>
}

export default React.memo(ChrImport)
