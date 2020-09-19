/// <reference path="./Home.d.ts" />

import React from 'react'
import { Flex, Heading, Text, SimpleGrid } from '@chakra-ui/core'

import { GamePreview } from './components/GamePreview'

import { theme } from '@app-shared/theme'
import { constants } from '@app-shared/constants'

export const Home: React.FC<HomeData> = ({ games }) => {
  return (
    <Flex justify="center" align="center" h="100vh" direction="column">
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
      <SimpleGrid p="1rem" columns={{ sm: 1, md: 2, lg: 3 }} spacing="1rem">
        {Object.keys(games).map((game) => (
          <GamePreview key={game} {...games[game as GameNames]} />
        ))}
      </SimpleGrid>
    </Flex>
  )
}

Home.displayName = constants.pages.home