import React from 'react'
import NextLink from 'next/link'
import { Text, Image, Link, IconButton } from '@chakra-ui/core'

import theme from '@app-shared/theme'

import styles from './GamePreview.module.css'
import GameOptionsContext from '@app-src/shared/contexts/GameOptionsContext'

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
  const gameOptions = React.useContext(GameOptionsContext)

  const onSettingsClick = (event: React.MouseEvent<any, MouseEvent>) => {
    event.stopPropagation()
    gameOptions.onGameSettingsClick!(gameName)
  }

  const onHelpClick = (event: React.MouseEvent<any, MouseEvent>) => {
    event.stopPropagation()
    gameOptions.onGameHelpClick!(gameName)
  }

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
        <IconButton
          aria-label={`${gameName} Game Settings`}
          icon="settings"
          position="absolute"
          right="1rem"
          top="1rem"
          onClick={onSettingsClick}
        />
        <IconButton
          aria-label={`${gameName} Game Help`}
          icon="question"
          position="absolute"
          right="1rem"
          top="4rem"
          onClick={onHelpClick}
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
