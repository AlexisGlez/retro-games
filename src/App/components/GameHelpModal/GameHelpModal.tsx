/// <reference path="./GameHelpModal.d.ts" />

import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from '@chakra-ui/core'

import { GameHelpSection } from './GameHelpSection'

type GameHelpModalProps = GameHelpModal.Game & {
  isOpen: boolean
  onClose: () => void
}

export const GameHelpModal: React.FC<GameHelpModalProps> = ({
  isOpen,
  onClose,
  gameName,
  gameHelp,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader fontSize="xl" textAlign="center">
        How to play {gameName}?
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody fontSize="lg">
        <GameHelpSection title="What do I need to do?" content={gameHelp.description} />
        <GameHelpSection title="When is the game over?" content={gameHelp.gameOver} mt="1.5rem" />
        <GameHelpSection title="How do I play?" content={gameHelp.controls} mt="1.5rem" />
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Button variantColor="green" mr={3} onClick={onClose}>
          Ok!
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)
