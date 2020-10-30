import { Box, Heading, Text } from '@chakra-ui/core'
import React from 'react'

type GameHelpSectionProps = {
  title: string
  content: string
  mt?: string
}

export const GameHelpSection: React.FC<GameHelpSectionProps> = ({ title, content, mt }) => (
  <Box mt={mt}>
    <Heading as="h3" fontSize="lg">
      {title}
    </Heading>
    <Text>{content}</Text>
  </Box>
)
