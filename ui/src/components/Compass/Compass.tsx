import { computed, signal } from '@preact/signals-react'

import { useNuiEvent } from '@hooks/useNuiEvent'
import { useConfig } from '@hooks/useConfig'

import styles from './Compass.module.css'

const heading = signal<number>(0)

type CompasTagID = 'N' | 'NV' | 'NØ' | 'V' | 'Ø' | 'S' | 'SV' | 'SØ'

const CompassTag = ({
  id,
  type,
  tagPositions,
}: {
  id: CompasTagID
  tagPositions: Record<CompasTagID, number>
  type: 'cardinal' | 'ordinal'
}) => {
  return (
    <>
      <div
        className={styles[type]}
        style={{ translate: `${tagPositions[id] * 2}px` }}
      >
        {/* {id == 'N' ? <img src={Navigate} draggable={false} /> : id} */}
        {id}
      </div>
      {id !== 'S' && (
        <div
          className={styles[type]}
          style={{ translate: `${(tagPositions[id] - 360) * 2}px` }}
        >
          {/* {id == 'N' ? <img src={Navigate} draggable={false} /> : id} */}
          {id}
        </div>
      )}
    </>
  )
}

const Compass = () => {
  const config = useConfig()

  useNuiEvent(
    'updateCompass',
    ({ heading: newHeading }: { heading: number }) => {
      heading.value = newHeading
    }
  )

  const tagPositions = computed<Record<CompasTagID, number>>(() => {
    const h = heading.value
    return {
      N: h + 180,
      NØ: h + 225,
      NV: h + 135,
      V: h + 90,
      Ø: h + 270,
      S: h,
      SØ: h + 315,
      SV: h + 45,
    }
  })

  return (
    <div
      className={styles.wrapper}
      style={{ opacity: config.value.compass ? 1 : 0 }}
    >
      {/* <input
        type="range"
        min={0}
        max={360}
        style={{ position: 'absolute', top: '45px', zIndex: 2 }}
        onChange={(e) => (heading.value = parseFloat(e.target.value))}
      /> */}
      <div className={styles.arrow}></div>
      <div className={styles.compass}>
        <div
          className={styles.inner}
          style={{
            backgroundPositionX: `${(heading.value / 360) * 1.053 * 100}%`,
          }}
        >
          <CompassTag
            id="N"
            type="cardinal"
            tagPositions={tagPositions.value}
          />
          <CompassTag
            id="S"
            type="cardinal"
            tagPositions={tagPositions.value}
          />
          <CompassTag
            id="Ø"
            type="cardinal"
            tagPositions={tagPositions.value}
          />
          <CompassTag
            id="V"
            type="cardinal"
            tagPositions={tagPositions.value}
          />

          <CompassTag
            id="NV"
            type="ordinal"
            tagPositions={tagPositions.value}
          />
          <CompassTag
            id="NØ"
            type="ordinal"
            tagPositions={tagPositions.value}
          />
          <CompassTag
            id="SV"
            type="ordinal"
            tagPositions={tagPositions.value}
          />
          <CompassTag
            id="SØ"
            type="ordinal"
            tagPositions={tagPositions.value}
          />
        </div>
      </div>
    </div>
  )
}

export default Compass
