import type { AppProps } from 'next/app'

import 'normalize.css'
import 'react-responsive-modal/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
