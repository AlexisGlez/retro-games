/// <reference path="./Home.d.ts" />

import React from 'react'
import Head from 'next/head'
import { Flex, Heading, Text, SimpleGrid, useDisclosure } from '@chakra-ui/core'

import { theme } from '@app-shared/theme'
import { GameOptionsContext } from '@app-shared/contexts/GameOptionsContext'
import { constants } from '@app-shared/constants'

import { GamePreview } from './components/GamePreview'
import { GameSettingsModal } from './components/GameSettingsModal'
import { GameHelpModal } from './components/GameHelpModal'

import { gamesSettings, gamesHelp } from '@app-src/App/config'

import styles from './Home.module.css'

type CurrentGame = GameSettingsModal.Game | GameHelpModal.Game

const gameOptions: GameOptionsContext = {}

export const Home: React.FC<HomeData> = ({ games, onGameConfigChange }) => {
  const [currentGamesSettings, setCurrentGamesSettings] = React.useState(gamesSettings)

  const gameSettingsModal = useDisclosure({ defaultIsOpen: false })
  const gameHelpModal = useDisclosure({ defaultIsOpen: false })

  const [currentGame, setCurrentGame] = React.useState<CurrentGame>({
    gameName: '',
    gameSettings: [],
    gameHelp: {
      description: '',
      controls: '',
      gameOver: '',
    },
  })

  gameOptions.onGameSettingsClick = (gameName: string) => {
    setCurrentGame((prevState) => ({
      ...prevState,
      gameName,
      gameSettings: currentGamesSettings[gameName as GameNames] as Array<GameSetting>,
    }))

    gameSettingsModal.onOpen()
  }

  gameOptions.onGameHelpClick = (gameName: string) => {
    setCurrentGame((prevState) => ({
      ...prevState,
      gameName,
      gameHelp: gamesHelp[gameName as GameNames],
    }))

    gameHelpModal.onOpen()
  }

  const onGameSettingsChanged = React.useCallback(
    (gameSettings: GameSettingsModal.GameSettingsUpdates) => {
      const newSettings = gameSettings.gameSettings.reduce((acc, curr) => {
        acc[curr.propertyName] = curr.newValue
        return acc
      }, {} as any)

      onGameConfigChange!((prevState) => ({
        ...prevState,
        [gameSettings.gameName]: {
          ...prevState[gameSettings.gameName as GameNames],
          ...newSettings,
        },
      }))

      setCurrentGamesSettings((prevState) => ({
        ...prevState,
        [gameSettings.gameName]: prevState[gameSettings.gameName as GameNames].map((settings) => ({
          ...settings,
          currentValue: newSettings[settings.propertyName],
        })),
      }))
    },
    [onGameConfigChange, setCurrentGamesSettings],
  )

  return (
    <GameOptionsContext.Provider value={gameOptions}>
      <Head>
        <title>Retro Games</title>
      </Head>
      <div className={styles.fixed}>
        <div className={styles.cover}>
          <div className={styles.layer} />
        </div>
      </div>
      <Flex justify="center" align="center" minH="100vh" pt="1rem" direction="column">
        <Heading
          fontSize="6xl"
          fontFamily="cursive"
          textAlign="center"
          fontWeight={theme.fontWeights.extrabold}
        >
          Retro Games
        </Heading>
        <Text my="1rem" fontSize="3xl" textAlign="center">
          What do you want to play?
        </Text>
        <SimpleGrid
          p="1rem"
          columns={{ sm: 1, md: 2, lg: 3 }}
          spacing="1rem"
          gridAutoRows="1fr"
          width="100%"
        >
          {Object.keys(games).map((game) => (
            <GamePreview key={game} {...games[game as GameNames]} />
          ))}
        </SimpleGrid>
      </Flex>
      <GameSettingsModal
        isOpen={gameSettingsModal.isOpen}
        onClose={gameSettingsModal.onClose}
        onGameSettingsChanged={onGameSettingsChanged}
        gameName={currentGame.gameName}
        gameSettings={(currentGame as GameSettingsModal.Game).gameSettings}
      />
      <GameHelpModal
        isOpen={gameHelpModal.isOpen}
        onClose={gameHelpModal.onClose}
        gameName={currentGame.gameName}
        gameHelp={(currentGame as GameHelpModal.Game).gameHelp}
      />
    </GameOptionsContext.Provider>
  )
}

Home.displayName = constants.pages.Home
