import { CSSProperties } from 'react'

import { signal } from '@preact/signals-react'
import { useNuiEvent } from '@hooks/useNuiEvent'
import { debugData } from '@utils/debugData'

import Burger from '@assets/icons/Burger.svg'
import Water from '@assets/icons/Water.svg'
import Lungs from '@assets/icons/Lungs.svg'

import styles from './Status.module.css'

const hungerLevel = signal<number>(0)
const thirstLevel = signal<number>(0)
const lungLevel = signal<number>(0)

debugData([
  {
    action: 'updateStatus',
    data: {
      hunger: 0.8,
      thirst: 0.2,
      lungs: 0.2,
    },
  },
])

const StatusLevel = ({
  level,
  color,
  icon,
}: {
  level: number
  color: string
  icon: string
}) => {
  return (
    <div
      className={styles['status-level']}
      style={
        {
          '--status-color': color,
          ...(level >= 0.8 ? {
            width: '10px',
            opacity: 0
          } : {})
        } as CSSProperties
      }
    >
      <svg width="100%" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="60"></circle>
        <circle
          className={styles.level}
          style={{
            strokeDasharray: `${377 * level}, 377`,
            opacity: level === 0 ? 0 : 1,
          }}
          cx="100"
          cy="100"
          r="60"
          strokeDasharray="0, 377"
        ></circle>
      </svg>
      <div>
        <img src={icon} draggable={false} />
      </div>
    </div>
  )
}

const Status = ({
  left,
  top,
  minimap,
}: {
  left: number
  top: number
  minimap: boolean
}) => {
  useNuiEvent(
    'updateStatus',
    ({
      hunger,
      thirst,
      lungs,
    }: {
      hunger: number
      thirst: number
      lungs: number
    }) => {
      hungerLevel.value = hunger
      thirstLevel.value = thirst
      lungLevel.value = lungs
    }
  )

  return (
    <div>
      <div
        className={styles.status}
        style={{
          left: `${left}vw`,
          top: `${top}vh`,
          marginLeft: minimap ? '12px' : '-2px',
          translate: minimap ? '0 -100%' : '0 -120px',
        }}
      >
        <StatusLevel
          level={hungerLevel.value}
          icon={Burger}
          color="249, 200, 109"
        />
        <StatusLevel
          level={thirstLevel.value}
          icon={Water}
          color="110, 181, 241"
        />
        <StatusLevel
          level={lungLevel.value}
          icon={Lungs}
          color="251, 96, 98"
        />
      </div>
    </div>
  )
}

export default Status
