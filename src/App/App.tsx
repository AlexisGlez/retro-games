/// <reference path="./App.d.ts" />

import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/core'

import { theme } from '@app-shared/theme'
import { constants } from '@app-src/shared/constants'
import { pagesConfig } from './config'

export function App({ Component, pageProps }: AppProps) {
  const [currentPagesConfig, setCurrentPagesConfig] = React.useState(pagesConfig)

  const additionalProps = currentPagesConfig[Component.displayName as PageNames] || {}
  if (Component.displayName === constants.pages.Home) {
    ;(additionalProps as HomeData).onGameConfigChange = setCurrentPagesConfig
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} {...additionalProps} />
    </ChakraProvider>
  )
}
