import { MinimapData } from '@customTypes/types'

import { useRef } from 'react'
import { effect, signal } from '@preact/signals-react'
import { debugData } from '@utils/debugData'
import { useNuiEvent } from '@hooks/useNuiEvent'
import { usePauseMap } from '@hooks/usePauseMap'
import { useConfig } from '@hooks/useConfig'

import HealthArmor from './HealthArmor/HealthArmor'
import Speedometer from './Speedometer/Speedometer'
import Mic from './Mic/Mic'
import Status from './Status/Status'

import styles from './Minimap.module.css'

const drawMinimap = signal<boolean>(false)
const minimapData = signal<MinimapData>({ x: 0, y: 0, width: 0, height: 0 })

const streetName = signal<string>('Ukendt')

debugData([
  {
    action: 'updateMinimap',
    data: {
      data: {
        x: 0.025125005990267,
        y: 0.79603869929372,
        width: 0.18719023572971,
        height: 0.16214310891787,
      },
      draw: true,
    },
  },
])

debugData(
  [
    {
      action: 'updateMinimap',
      data: {
        data: {
          x: 0.025125005990267,
          y: 0.79603869929372,
          width: 0.18719023572971,
          height: 0.16214310891787,
        },
        draw: false,
      },
    },
  ],
  3000
)

debugData(
  [
    {
      action: 'updateMinimap',
      data: {
        data: {
          x: 0.025125005990267,
          y: 0.79603869929372,
          width: 0.18719023572971,
          height: 0.16214310891787,
        },
        draw: true,
      },
    },
  ],
  6000
)

debugData(
  [
    {
      action: 'updateStreetName',
      data: {
        name: 'sinner st',
      },
    },
  ],
  2000
)

debugData(
  [
    {
      action: 'updateStreetName',
      data: {
        name: 'Innocence Blvd',
      },
    },
  ],
  4000
)

let lastStreetName = ''
const Minimap = () => {
  const config = useConfig()
  const pauseMapOpen = usePauseMap()

  const streetNameRef = useRef<HTMLParagraphElement>(null)

  useNuiEvent(
    'updateMinimap',
    ({ data, draw }: { data: MinimapData; draw: boolean }) => {
      drawMinimap.value = draw

      Object.entries(data).forEach(([k]) => (data[k] *= 100))
      data.x += config.value.minimapOffsetX
      data.y += config.value.minimapOffsetY

      minimapData.value = data
    }
  )

  useNuiEvent('updateStreetName', ({ name }: { name: string }) => {
    streetName.value = name
  })

  effect(() => {
    if (streetName.value === lastStreetName) return
    lastStreetName = streetName.value

    const animLength = 250

    if (!streetNameRef.current) return
    streetNameRef.current.style.animation = `${styles['location-change']} ${animLength}ms ease-in-out`

    setTimeout(() => {
      if (!streetNameRef.current) return
      streetNameRef.current.style.animation = ''
    }, animLength)
  })

  if (pauseMapOpen) return null

  return (
    <>
      {drawMinimap.value && (
        <>
          <div
            className={styles.location}
            style={{
              left: `${minimapData.value.x}vw`,
              bottom: `${102 - minimapData.value.y}vh`,
            }}
          >
            <svg
              width="26"
              height="32"
              viewBox="0 0 26 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 16C13.8938 16 14.6589 15.6867 15.2953 15.06C15.9318 14.4333 16.25 13.68 16.25 12.8C16.25 11.92 15.9318 11.1667 15.2953 10.54C14.6589 9.91333 13.8938 9.6 13 9.6C12.1062 9.6 11.3411 9.91333 10.7047 10.54C10.0682 11.1667 9.75 11.92 9.75 12.8C9.75 13.68 10.0682 14.4333 10.7047 15.06C11.3411 15.6867 12.1062 16 13 16ZM13 32C8.63958 28.3467 5.38281 24.9533 3.22969 21.82C1.07656 18.6867 0 15.7867 0 13.12C0 9.12 1.30677 5.93333 3.92031 3.56C6.53385 1.18667 9.56042 0 13 0C16.4396 0 19.4661 1.18667 22.0797 3.56C24.6932 5.93333 26 9.12 26 13.12C26 15.7867 24.9234 18.6867 22.7703 21.82C20.6172 24.9533 17.3604 28.3467 13 32Z"
                fill="rgb(var(--color-primary))"
              />
            </svg>

            <div>
              <h3>Lokation</h3>
              <p ref={streetNameRef}>{streetName.value}</p>
            </div>
          </div>

          <div
            className={styles.minimap}
            style={{
              left: `${minimapData.value.x}vw`,
              top: `${minimapData.value.y}vh`,
              width: `${minimapData.value.width}vw`,
              height: `${minimapData.value.height - 1.6243}vh`,
            }}
          ></div>

          <Speedometer
            left={minimapData.value.x + minimapData.value.width}
            bottom={
              100 - (minimapData.value.y + minimapData.value.height - 1.6243)
            }
          />
        </>
      )}

      <Mic
        right={100 - (minimapData.value.x + minimapData.value.width)}
        left={minimapData.value.x + minimapData.value.width}
        bottom={
          drawMinimap.value
            ? 102 - minimapData.value.y
            : 100 - (minimapData.value.y + minimapData.value.height - 0.8)
        }
        minimap={drawMinimap.value}
      />

      <HealthArmor
        left={minimapData.value.x}
        top={minimapData.value.y + minimapData.value.height - 1.6243}
        width={minimapData.value.width}
        minimap={drawMinimap.value}
      />

      <Status
        left={
          drawMinimap.value
            ? minimapData.value.x + minimapData.value.width
            : minimapData.value.x
        }
        top={minimapData.value.y + minimapData.value.height}
        minimap={drawMinimap.value}
      />
    </>
  )
}

export default Minimap
