namespace GameSettingsModal {
  type Game = {
    gameName: string
    gameSettings: Array<GameSetting>
  }

  type GameSettingsUpdates = {
    gameName: string
    gameSettings: Array<{
      propertyName: string
      oldValue: any
      newValue: any
    }>
  }
}
