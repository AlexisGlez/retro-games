import React from 'react'
import NextLink from 'next/link'
import { Text, Image, Link } from '@chakra-ui/core'

import theme from '@app-shared/theme'

import styles from './GamePreview.module.css'

const gameBorder = 8
const imageMaxHeight = 300

interface GamePreviewProps {
  gameName: string
  gamePageName: string
  imageName: string
  imageAlt: string
}

const GamePreview: React.FC<GamePreviewProps> = ({
  gameName,
  gamePageName,
  imageName,
  imageAlt,
}) => {
  return (
    <NextLink href={`/${gamePageName}`}>
      <Link
        className={styles.link}
        display="block"
        position="relative"
        borderWidth={1}
        borderColor={theme.colors.whiteAlpha[500]}
        borderRadius={gameBorder}
      >
        <Image
          position="absolute"
          src={`/img/${imageName}.png`}
          alt={`${imageAlt} Demo Placeholder`}
          maxHeight={imageMaxHeight}
          borderRadius={gameBorder}
        />
        <Image
          src={`/img/${imageName}.gif`}
          alt={`${imageAlt} Demo`}
          maxHeight={imageMaxHeight}
          borderRadius={gameBorder}
        />
        <Text
          position="absolute"
          right="1rem"
          bottom="1rem"
          fontSize="lg"
          fontWeight={theme.fontWeights.semibold}
        >
          {gameName}
        </Text>
      </Link>
    </NextLink>
  )
}

export default GamePreview
