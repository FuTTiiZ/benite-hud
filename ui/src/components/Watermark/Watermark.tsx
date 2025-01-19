import { signal } from '@preact/signals-react'
import { useEffect } from 'react'
import { useNuiEvent } from '@hooks/useNuiEvent'
import { usePauseMap } from '@hooks/usePauseMap'
import { useConfig } from '@hooks/useConfig'
import { debugData } from '@utils/debugData'

import Accounts from './Accounts/Accounts'

import TimeIcon from '@assets/icons/TimeIcon.svg'
import PingIcon from '@assets/icons/PingIcon.svg'
import DateIcon from '@assets/icons/DateIcon.svg'
import UserIcon from '@assets/icons/UserIcon.svg'

import styles from './Watermark.module.css'

const InfoBox = ({ icon, text }: { icon: string; text: string }) => (
  <div className={styles.infobox}>
    <img src={icon} draggable={false} />
    <p>{text}</p>
  </div>
)

const drawInfo = signal<boolean>(false)
const timestamp = signal<Date>(new Date())
const ping = signal<number>(0)
const players = signal<number>(0)

debugData([
  {
    action: 'updatePing',
    data: {
      ping: 25,
    },
  },
])

const Watermark = ({ logoUrl }: { logoUrl: string }) => {
  const pauseMapOpen = usePauseMap()
  const config = useConfig()

  useEffect(() => {
    setInterval(() => {
      timestamp.value = new Date()
    }, 1000)
  }, [])

  useNuiEvent(
    'updatePing',
    ({ ping: newPing }: { ping: number }) => (ping.value = newPing)
  )

  useNuiEvent(
    'updatePlayers',
    ({ count }: { count: number }) => (players.value = count)
  )

  useNuiEvent(
    'updateInfo',
    ({ draw }: { draw: boolean }) => (drawInfo.value = draw)
  )

  if (pauseMapOpen) return null

  return (
    <div className={styles.watermark}>
      <div
        className={styles.info}
        style={{ opacity: drawInfo.value || config.value.stickyInfo ? 1 : 0 }}
      >
        <InfoBox
          icon={DateIcon}
          text={timestamp.value
            .toLocaleString('da-DK', { day: 'numeric', month: 'short' })
            .slice(0, -1)}
        />
        <InfoBox
          icon={TimeIcon}
          text={timestamp.value
            .toLocaleString('da-DK', { timeStyle: 'short' })
            .replace('.', ':')}
        />
        <InfoBox icon={PingIcon} text={ping.value.toString()} />
        <InfoBox icon={UserIcon} text={players.value.toString()} />
      </div>
      <img className={styles.logo} src={logoUrl} draggable={false} alt="Logo" />
      <Accounts />
    </div>
  )
}

export default Watermark
