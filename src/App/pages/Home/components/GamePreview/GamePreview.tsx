/// <reference path="./GamePreview.d.ts" />

import React from 'react'
import NextLink from 'next/link'
import { Text, Image, Link, IconButton, DarkMode } from '@chakra-ui/core'
import { SettingsIcon, QuestionIcon } from '@chakra-ui/icons'

const Icons = {
  Settings: SettingsIcon as any,
  Question: QuestionIcon as any,
}

import { theme } from '@app-shared/theme'
import { GameOptionsContext } from '@app-shared/contexts/GameOptionsContext'

import styles from './GamePreview.module.css'

const gameBorder = 8

export const GamePreview: React.FC<GamePreview> = ({
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
          width="100%"
          height="100%"
          objectFit="cover"
          borderRadius={gameBorder}
        />
        <Image
          src={`/img/${imageName}.gif`}
          alt={`${imageAlt} Demo`}
          width="100%"
          height="100%"
          objectFit="cover"
          borderRadius={gameBorder}
        />
        <DarkMode>
          <IconButton
            aria-label={`${gameName} Game Settings`}
            icon={<Icons.Settings />}
            position="absolute"
            right="1rem"
            top="1rem"
            onClick={onSettingsClick}
          />
        </DarkMode>
        <DarkMode>
          <IconButton
            aria-label={`${gameName} Game Help`}
            icon={<Icons.Question />}
            position="absolute"
            right="1rem"
            top="4rem"
            onClick={onHelpClick}
          />
        </DarkMode>
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
