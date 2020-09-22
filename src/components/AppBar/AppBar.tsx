import React from 'react'
import { Link } from 'react-router-dom'
import styles from './AppBar.module.css'
import githubLogo from '../../assets/github/GitHub-Mark-Light-120px-plus.png'

export const AppBar: React.FC = () => {
    return (
        <div className={styles.container}>
            <nav className={styles.pages}>
                <Link to="/bam-paperdoll" className={styles.menu}>
                    Paperdolls
                </Link>
            </nav>
            <div className={styles.links}>
                <a href="https://github.com/Dergash/d9" className={styles.link}>
                    <img src={githubLogo} alt="Visit repository on GitHub" className={styles.img} />
                </a>
            </div>
        </div>
    )
}

export default React.memo(AppBar)
