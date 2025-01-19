import { signal } from '@preact/signals-react'
import { useNuiEvent } from '@hooks/useNuiEvent'

import styles from './Mic.module.css'

const micActive = signal<boolean>(false)
const proximity = signal<string>('Normal')

const Mic = ({
  right,
  left,
  bottom,
  minimap,
}: {
  right: number
  left: number
  bottom: number
  minimap: boolean
}) => {
  useNuiEvent(
    'updateMic',
    ({
      active,
      proximity: newProximity,
    }: {
      active: boolean
      proximity: string
    }) => {
      micActive.value = active
      proximity.value = newProximity
    }
  )

  return (
    <div
      className={`${styles.mic} ${micActive.value && styles.active} ${
        !minimap && styles['no-minimap']
      }`}
      style={{
        ...(minimap
          ? { right: `calc(${right}vw - 7px)` }
          : { left: `${left - 2}vw` }),
        bottom: `calc(${bottom}vh - 5px)`,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
      >
        <g>
          <path
            id="Vector"
            d="M12 14C11.1667 14 10.4583 13.7083 9.875 13.125C9.29167 12.5417 9 11.8333 9 11V5C9 4.16667 9.29167 3.45833 9.875 2.875C10.4583 2.29167 11.1667 2 12 2C12.8333 2 13.5417 2.29167 14.125 2.875C14.7083 3.45833 15 4.16667 15 5V11C15 11.8333 14.7083 12.5417 14.125 13.125C13.5417 13.7083 12.8333 14 12 14ZM11 21V17.925C9.26667 17.6917 7.83333 16.9167 6.7 15.6C5.56667 14.2833 5 12.75 5 11H7C7 12.3833 7.4875 13.5625 8.4625 14.5375C9.4375 15.5125 10.6167 16 12 16C13.3833 16 14.5625 15.5125 15.5375 14.5375C16.5125 13.5625 17 12.3833 17 11H19C19 12.75 18.4333 14.2833 17.3 15.6C16.1667 16.9167 14.7333 17.6917 13 17.925V21H11Z"
          />
        </g>
      </svg>
      <p className={styles.proximity}>{proximity.value}</p>
    </div>
  )
}

export default Mic
