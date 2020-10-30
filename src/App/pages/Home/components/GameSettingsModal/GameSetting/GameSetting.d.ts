type GameSetting = {
  propertyName: string
  displayName: string
  helperText: string
  type: string
  currentValue: any
  step?: number
  min?: number
  max?: number
  options?: Array<string>
}
