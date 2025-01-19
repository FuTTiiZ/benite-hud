import { HUDConfig, HUDConfigProp } from '@customTypes/types'

import { signal } from '@preact/signals-react'
import { usePauseMap } from '@hooks/usePauseMap'
import { useConfig } from '@hooks/useConfig'

import { useNuiEvent } from '@hooks/useNuiEvent'
import { debugData } from '@utils/debugData'
import { isEnvBrowser } from '@utils/misc'
import { fetchNui } from '@utils/fetchNui'

import styles from './ConfigMenu.module.css'

const drawMenu = signal<boolean>(false)

debugData([
  {
    action: 'updateConfigMenu',
    data: {
      draw: true,
      config: {
        stickyAccounts: false,
        stickyInfo: true,
        compass: true,
        minimapOffsetX: 0,
        minimapOffsetY: 0,
      },
    },
  },
])

const ConfigPropBool = ({
  name,
  tag,
  onChange,
}: {
  name: string
  tag: HUDConfigProp
  onChange?: (value: boolean) => void
}) => {
  const config = useConfig()

  return (
    <div className={styles.prop}>
      <h2>{name}</h2>
      <input
        type="checkbox"
        checked={config.value[tag] as boolean}
        onChange={({ target: { checked } }) => {
          config.value = { ...config.value, [tag]: checked }
          if (onChange) onChange(checked)
          if (!isEnvBrowser())
            fetchNui('setConfigBool', { key: tag, value: checked })
        }}
      />
    </div>
  )
}

document.onkeyup = (e) => {
  if (e.key === 'Space' || e.key === 'Enter') e.preventDefault()
}

const ConfigMenu = () => {
  const pauseMapOpen = usePauseMap()
  const config = useConfig()

  useNuiEvent(
    'updateConfigMenu',
    ({ draw, config: newConfig }: { draw: boolean; config?: HUDConfig }) => {
      if (newConfig) config.value = { ...config.value, ...newConfig }

      if (pauseMapOpen) return
      drawMenu.value = draw
    }
  )

  if (pauseMapOpen) return null

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.menu} ${drawMenu.value && styles.active}`}>
        <button
          className={styles.x}
          onClick={() => {
            if (!isEnvBrowser()) fetchNui('closeConfigMenu', {})
            drawMenu.value = false
          }}
        >
          X
        </button>
        <h1>HUD Konfiguration</h1>

        <ConfigPropBool name="Fastgør Penge" tag="stickyAccounts" />
        <ConfigPropBool name="Fastgør Info" tag="stickyInfo" />
        <ConfigPropBool name="Kompas" tag="compass" />

        <hr />

        <div className={styles['minimap-offset']}>
          <h2 style={{ marginBottom: '12px' }}>Minimap Overlay Offset</h2>
          <div>
            <p>Vandret:</p>
            <input
              type="number"
              defaultValue={config.value.minimapOffsetX || 0}
              onChange={({ target: { value } }) => {
                config.value = {
                  ...config.value,
                  minimapOffsetX: parseFloat(value),
                }
                if (!isEnvBrowser())
                  fetchNui('setConfigFloat', {
                    key: 'minimapOffsetX',
                    value: value,
                  })
              }}
            />
          </div>
          <div>
            <p>Lodret:</p>
            <input
              type="number"
              defaultValue={config.value.minimapOffsetY || 0}
              onChange={({ target: { value } }) => {
                config.value = {
                  ...config.value,
                  minimapOffsetY: parseFloat(value),
                }
                if (!isEnvBrowser())
                  fetchNui('setConfigFloat', {
                    key: 'minimapOffsetY',
                    value: value,
                  })
              }}
            />
          </div>
        </div>

        {/* <footer className={styles.footer}>
          <p>&copy; Navigate 2023</p>
          <img
            className={styles.logo}
            src={Navigate}
            alt="Navigate"
            draggable={false}
            onClick={() => {
              const audio = new Audio('https://benite.xyz/files/gudesmuk.mp3')
              audio.volume = 0.2
              audio.play()
              audio.onended = () => audio.remove()
            }}
          />
        </footer> */}
      </div>
    </div>
  )
}

export default ConfigMenu
