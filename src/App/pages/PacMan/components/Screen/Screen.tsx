import React from 'react'

import styles from './Screen.module.css'

type ScreenProps = {}

export const Screen: React.FC<ScreenProps> = ({}) => {
  return <div className={styles.screen}>Hello 🌎</div>
}
