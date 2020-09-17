import React from 'react'
import {
  FormControl,
  FormLabel,
  Select,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/core'

type GameSetting = {
  propertyName: string
  displayName: string
  helperText: string
  type: string
  currentValue: number
  step: number
  min: number
  max: number
}

type GameSettingProps = GameSetting & {
  onFormValueChange: (propertyName: string, value: any) => void
}

const GameSetting: React.FC<GameSettingProps> = ({
  propertyName,
  displayName,
  helperText,
  type,
  currentValue,
  step,
  min,
  max,
  onFormValueChange,
}) => {
  if (type !== 'number') {
    return null
  }

  let component: React.ReactNode = null

  if (max / step < 10) {
    const options: Array<React.ReactNode> = []

    for (let i = min; i <= max; i += step) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>,
      )
    }

    component = (
      <Select
        id={propertyName}
        aria-describedby={`${propertyName}-helper-text`}
        onChange={(e) => {
          onFormValueChange(propertyName, Number(e.target.value))
        }}
        defaultValue={currentValue}
      >
        {options}
      </Select>
    )
  } else {
    component = (
      <NumberInput
        step={step}
        min={min}
        max={max}
        clampValueOnBlur={false}
        defaultValue={currentValue}
        onChange={(value) => {
          onFormValueChange(propertyName, Number(value))
        }}
      >
        <NumberInputField id={propertyName} type="number" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    )
  }

  return (
    <FormControl mb="1rem">
      <FormLabel htmlFor={propertyName}>{displayName}</FormLabel>
      {component}
      <FormHelperText id={`${propertyName}-helper-text`}>{helperText}</FormHelperText>
    </FormControl>
  )
}

export default GameSetting
