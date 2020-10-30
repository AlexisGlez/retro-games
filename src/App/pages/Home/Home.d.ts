type HomeData = {
  onGameConfigChange?: React.Dispatch<React.SetStateAction<PagesConfig>>
  games: {
    [key in GameNames]: GamePreview
  }
}
