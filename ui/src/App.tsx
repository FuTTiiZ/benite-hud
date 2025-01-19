import { signal } from '@preact/signals-react'

import Compass from '@components/Compass/Compass'
import Watermark from '@components/Watermark/Watermark'
import Minimap from '@components/Minimap/Minimap'
import ConfigMenu from '@components/ConfigMenu/ConfigMenu'

import { ConfigProvider } from '@providers/ConfigContext'
import { PauseMapProvider } from '@providers/PauseMapContext'

import { debugData } from '@utils/debugData'
import { useNuiEvent } from '@hooks/useNuiEvent'

import { isEnvBrowser } from '@utils/misc'
import { useEffect } from 'react'
import { fetchNui } from '@utils/fetchNui'
if (isEnvBrowser()) document.body.style.background = '#3f3f3f'

const logoUrl = signal<string>(
  'https://benite.xyz/assets/benite-logo.9233d4ca.svg'
)

debugData([
  {
    action: 'updatePauseMapOpen',
    data: {
      open: false,
    },
  },
])

debugData([
  {
    action: 'setupHUD',
    data: {
      color: [255, 0, 0],
      logoUrl: 'https://benite.xyz/assets/benite-logo.9233d4ca.svg',
    },
  },
])

const App = () => {
  useNuiEvent(
    'setupHUD',
    ({
      color,
      logoUrl: newLogoUrl,
    }: {
      color: [number, number, number]
      logoUrl: string
    }) => {
      document.body.style.setProperty('--color-primary', color.join(', '))
      logoUrl.value = newLogoUrl
    }
  )

  useEffect(() => {
    if (isEnvBrowser()) return

    fetchNui('nuiReady', {})
  }, [])

  return (
    <>
      <ConfigProvider>
        <PauseMapProvider>
          <Compass />
          <Watermark logoUrl={logoUrl.value} />
          <Minimap />
          <ConfigMenu />
        </PauseMapProvider>
      </ConfigProvider>
    </>
  )
}

export default App
