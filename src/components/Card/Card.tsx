import React from 'react'
import styles from './Card.module.css'

interface CardProps {
  title?: React.ReactNode
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = props => {
  return (
    <div className={styles.container}>
      {typeof props.title === 'string' && (
        <h2 className={styles.title}>{props.title}</h2>
      )}
      {typeof props.title !== 'string' && props.title}
      {props.children}
    </div>
  )
}

export default React.memo(Card)
