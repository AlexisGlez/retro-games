/// <reference path="./GameSetting.d.ts" />

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

type GameSettingProps = GameSetting & {
  onFormValueChange: (propertyName: string, value: any) => void
}

export const GameSetting: React.FC<GameSettingProps> = ({
  propertyName,
  displayName,
  helperText,
  type,
  currentValue,
  step,
  min,
  max,
  options,
  onFormValueChange,
}) => {
  if (type !== 'number' && type !== 'string') {
    return null
  }

  let component: React.ReactNode = null

  if (type === 'string') {
    component = (
      <Select
        id={propertyName}
        aria-describedby={`${propertyName}-helper-text`}
        onChange={(e) => {
          onFormValueChange(propertyName, e.target.value)
        }}
        defaultValue={currentValue}
      >
        {options!.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
    )
  } else {
    if (max! / step! < 10) {
      const numberOptions: Array<React.ReactNode> = []

      for (let i = min!; i <= max!; i += step!) {
        numberOptions.push(
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
          {numberOptions}
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
  }

  return (
    <FormControl mb="1rem">
      <FormLabel htmlFor={propertyName}>{displayName}</FormLabel>
      {component}
      <FormHelperText id={`${propertyName}-helper-text`}>{helperText}</FormHelperText>
    </FormControl>
  )
}
