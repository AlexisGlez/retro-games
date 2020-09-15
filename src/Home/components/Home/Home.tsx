import React from 'react'
import { Flex, Heading, Text, SimpleGrid } from '@chakra-ui/core'

import GamePreview from './components/GamePreview'

import theme from '@app-shared/theme'

const Home: React.FC = () => {
  return (
    <Flex justify="center" align="center" h="100vh" direction="column">
      <Heading fontSize="6xl" fontFamily="cursive" fontWeight={theme.fontWeights.extrabold}>
        Retro Games
      </Heading>
      <Text my="1rem" fontSize="3xl">
        What do you want to play?
      </Text>
      <SimpleGrid p="1rem" columns={{ sm: 1, md: 2, lg: 3 }} spacing="1rem">
        <GamePreview
          gameName="Snake"
          gamePageName="snake"
          imageName="snake_demo"
          imageAlt="Snake Game"
        />
      </SimpleGrid>
    </Flex>
  )
}

export default Home
