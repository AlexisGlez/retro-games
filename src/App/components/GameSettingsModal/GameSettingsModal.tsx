/// <reference path="./GameSettingsModal.d.ts" />

import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Flex,
} from '@chakra-ui/core'

import { GameSetting } from './GameSetting'

type GameSettingsModalProps = GameSettingsModal.Game & {
  isOpen: boolean
  onClose: () => void
  onGameSettingsChanged: (gameSettings: GameSettingsModal.GameSettingsUpdates) => void
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  onClose,
  gameName,
  gameSettings,
  onGameSettingsChanged,
}) => {
  const initialFormValues = gameSettings.reduce((curr: any, acc) => {
    curr[acc.propertyName] = acc.currentValue
    return curr
  }, {})

  const [formValues, setFormValues] = React.useState<{ [key: string]: any }>(initialFormValues)

  const onFormValueChange = (propertyName: string, value: any) => {
    setFormValues((prevState) => ({
      ...prevState,
      [propertyName]: value,
    }))
  }

  const onSettingsChanged = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const updatedGameSettings = Object.keys(formValues).map((key) => {
      const currSetting = gameSettings.find((setting) => setting.propertyName === key)

      return {
        propertyName: key,
        oldValue: currSetting?.currentValue,
        newValue:
          currSetting?.type === 'number'
            ? Math.min(Number(formValues[key]), currSetting.max!)
            : formValues[key],
      }
    })

    onGameSettingsChanged({ gameName, gameSettings: updatedGameSettings })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="xl" textAlign="center">
          Customize your experience for {gameName}!
        </ModalHeader>
        <ModalBody fontSize="lg">
          <form onSubmit={onSettingsChanged}>
            {gameSettings.map((gameSetting) => (
              <GameSetting
                key={gameSetting.propertyName}
                {...gameSetting}
                onFormValueChange={onFormValueChange}
              />
            ))}
            <Flex p="1rem" justifyContent="space-around">
              <Button variantColor="green" type="submit">
                Done!
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
