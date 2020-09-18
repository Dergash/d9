import React from 'react'
import {Link} from 'react-router-dom'
import styles from './AppBar.module.css'

export const AppBar: React.FC = () => {
    return <div className={styles.container}>
        <Link to="/bam-paperdoll" className={styles.link}>
            Paperdolls
        </Link>
    </div>
}

export default React.memo(AppBar)
