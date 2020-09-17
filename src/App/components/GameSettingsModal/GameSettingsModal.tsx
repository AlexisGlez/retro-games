import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
  Flex,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/core'

export type GameSettings = {
  propertyName: string
  displayName: string
  helperText: string
  type: string
  currentValue: number
  step: number
  min: number
  max: number
}

export type Game = {
  gameName: string
  gameSettings: Array<GameSettings>
}

export type GameSettingsUpdates = {
  gameName: string
  gameSettings: Array<{
    propertyName: string
    oldValue: any
    newValue: any
  }>
}

interface GameSettingsModalProps extends Game {
  isOpen: boolean
  onClose: () => void
  onGameSettingsChanged: (gameSettings: GameSettingsUpdates) => void
}

const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
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

  const onSettingsChanged = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const updatedGameSettings = Object.keys(formValues).map((key) => {
      const currSetting = gameSettings.find((setting) => setting.propertyName === key)

      return {
        propertyName: key,
        oldValue: currSetting?.currentValue,
        newValue:
          currSetting?.type === 'number'
            ? Math.min(Number(formValues[key]), currSetting.max)
            : formValues[key],
      }
    })

    onGameSettingsChanged({ gameName, gameSettings: updatedGameSettings })
    onClose()
  }

  // TODO: REFACTOR THE SHIT BELOW

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="xl" textAlign="center">
          Customize your experience for {gameName}!
        </ModalHeader>
        <ModalBody fontSize="lg">
          <form onSubmit={onSettingsChanged}>
            {gameSettings.map((gameSetting) => {
              if (gameSetting.type !== 'number') {
                return null
              }

              if (gameSetting.max / gameSetting.step < 10) {
                const options: Array<React.ReactNode> = []

                for (let i = gameSetting.min; i <= gameSetting.max; i += gameSetting.step) {
                  options.push(
                    <option key={i} value={i}>
                      {i}
                    </option>,
                  )
                }

                return (
                  <FormControl key={gameSetting.propertyName} mb="1rem">
                    <FormLabel htmlFor={gameSetting.propertyName}>
                      {gameSetting.displayName}
                    </FormLabel>
                    <Select
                      id={gameSetting.propertyName}
                      aria-describedby={`${gameSetting.propertyName}-helper-text`}
                      onChange={(e) => {
                        setFormValues((prevState) => ({
                          ...prevState,
                          [gameSetting.propertyName]: Number(e.target.value),
                        }))
                      }}
                      defaultValue={gameSetting.currentValue}
                    >
                      {options}
                    </Select>
                    <FormHelperText id={`${gameSetting.propertyName}-helper-text`}>
                      {gameSetting.helperText}
                    </FormHelperText>
                  </FormControl>
                )
              }

              return (
                <FormControl key={gameSetting.propertyName} mb="1rem">
                  <FormLabel htmlFor={gameSetting.propertyName}>
                    {gameSetting.displayName}
                  </FormLabel>
                  <NumberInput
                    step={gameSetting.step}
                    min={gameSetting.min}
                    max={gameSetting.max}
                    clampValueOnBlur={false}
                    defaultValue={gameSetting.currentValue}
                    onChange={(value) => {
                      setFormValues((prevState) => ({
                        ...prevState,
                        [gameSetting.propertyName]: Number(value),
                      }))
                    }}
                  >
                    <NumberInputField id={gameSetting.propertyName} type="number" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText id={`${gameSetting.propertyName}-helper-text`}>
                    {gameSetting.helperText}
                  </FormHelperText>
                </FormControl>
              )
            })}
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

export default GameSettingsModal
