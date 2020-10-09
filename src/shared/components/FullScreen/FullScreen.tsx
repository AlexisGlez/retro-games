import React from 'react'

import styles from './FullScreen.module.css'

type FullScreenProps = {
  containerProps?: Object
}

export const FullScreen: React.FC<FullScreenProps> = ({ children, containerProps = {} }) => {
  return (
    <div className={styles.size} {...containerProps}>
      {children}
    </div>
  )
}
