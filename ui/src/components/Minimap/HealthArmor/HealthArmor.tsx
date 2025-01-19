import { signal } from '@preact/signals-react'
import { useNuiEvent } from '@hooks/useNuiEvent'

import styles from './HealthArmor.module.css'

const health = signal<number>(100)
const armor = signal<number>(70)

const HealthArmor = ({
  left,
  top,
  width,
  minimap,
}: {
  left: number
  top: number
  width: number
  minimap: boolean
}) => {
  useNuiEvent(
    'updateHealthArmor',
    ({
      health: newHealth,
      armor: newArmor,
    }: {
      health: number
      armor: number
    }) => {
      health.value = newHealth
      armor.value = newArmor
    }
  )

  return (
    <div
      className={`${styles['health-armor']} ${
        !minimap && styles['no-minimap']
      }`}
      style={{
        left: `${left}vw`,
        top: `calc(${top}vh + 5px)`,
        width: `${width}vw`,
        opacity: health.value > 0 ? 0.8 : 0,
      }}
    >
      <div className={styles.health}>
        <span style={{ width: `${Math.min(health.value, 100)}%` }}></span>
      </div>
      <div className={styles.armor}>
        <span style={{ width: `${Math.min(armor.value, 100)}%` }}></span>
      </div>
    </div>
  )
}

export default HealthArmor
