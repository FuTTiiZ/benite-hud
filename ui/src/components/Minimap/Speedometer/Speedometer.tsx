import { signal } from '@preact/signals-react'

import { useNuiEvent } from '@hooks/useNuiEvent'
import { debugData } from '@utils/debugData'

import Seatbelt from '@assets/icons/Seatbelt.svg'
import Fuel from '@assets/icons/Fuel.svg'
import Altitude from '@assets/icons/Altitude.svg'
import Wind from '@assets/icons/Wind.svg'

import styles from './Speedometer.module.css'

const drawSpeedometer = signal<boolean>(false)
const drawSeatbelt = signal<boolean>(false)

const gearLabels = {
  [-1]: '<Ingen Stel>',
  [0]: 'Nede',
  [1]: 'Hæver',
  [2]: '???',
  [3]: 'Sænker',
  [4]: 'Oppe',
  [5]: '', //'Ødelagt',
}
type GearLabels = typeof gearLabels
type GearState = keyof GearLabels
const gearState = signal<GearState>(-1)

const displayKnots = signal<boolean>(false)
const isHeli = signal<boolean>(false)
const isPlane = signal<boolean>(false)

const altitude = signal<number | null>(0)
const rotorHealth = signal<number>(0)
const tailHealth = signal<number>(0)

const windDirection = signal<{ x: number; y: number; speed: number }>({
  x: 0,
  y: 0,
  speed: 0,
})

const maxSpeed = signal<number>(0)
const speed = signal<string>('0')
const fSpeed = signal<number>(0)

const seatbelt = signal<boolean>(false)

const fuelLevel = signal<number>(0)

// debugData([
//   {
//     action: 'updateSpeed',
//     data: {
//       maxSpeed: 200,
//       speed: 45,
//       draw: true,
//       drawBelt: true,
//     },
//   },
// ])

debugData([
  {
    action: 'updateSpeed',
    data: {
      speed: 8,
      altitude: 100,
      rotorHealth: 1000,
      tailHealth: 1000,
      gear: 0,
      draw: true,
      knots: true,
      heli: true,
    },
  },
])

// debugData([
//   {
//     action: 'updateSpeed',
//     data: {
//       speed: 8,
//       draw: true,
//       knots: true,
//     },
//   },
// ])

debugData([
  {
    action: 'updateFuel',
    data: {
      fuel: 100,
    },
  },
])

const bladeSpeed = (s: number) => {
  // if (s <= 0) return 0
  // else
  if (s <= 10) return 0.8
  else if (s <= 40) return 0.7
  else return 0.6
}

const Speedometer = ({ left, bottom }: { left: number; bottom: number }) => {
  useNuiEvent(
    'updateSpeed',
    ({
      speed: newSpeed,
      altitude: newAltitude,
      rotorHealth: newRotorHealth,
      tailHealth: newTailHealth,
      gear,
      heli,
      plane,
      knots,
      wind,
      draw,
      drawBelt,
      maxSpeed: newMaxSpeed,
    }: {
      speed: number
      altitude: number | null
      rotorHealth: number
      tailHealth: number
      gear: GearState
      heli: boolean
      plane: boolean
      knots: boolean
      wind: { x: number; y: number; speed: number }
      draw: boolean
      drawBelt: boolean
      maxSpeed: number
    }) => {
      drawSeatbelt.value = drawBelt
      drawSpeedometer.value = draw

      maxSpeed.value = newMaxSpeed
      displayKnots.value = knots

      if (wind) windDirection.value = wind

      if (gear || gear == 0) gearState.value = gear
      else gearState.value = -1

      isHeli.value = heli
      isPlane.value = plane
      altitude.value = newAltitude
      rotorHealth.value = newRotorHealth
      tailHealth.value = newTailHealth

      fSpeed.value = newSpeed

      if (!draw) return
      speed.value = newSpeed.toString()
    }
  )

  useNuiEvent(
    'updateSeatbelt',
    ({ belt }: { belt: boolean }) => (seatbelt.value = belt)
  )

  useNuiEvent(
    'updateFuel',
    ({ fuel }: { fuel: number }) => (fuelLevel.value = fuel)
  )

  if (!drawSpeedometer.value) return null

  return (
    <>
      <div
        className={styles.indicators}
        style={{
          left: `${left}vw`,
          marginLeft: displayKnots.value ? '28px' : '1rem',
          bottom: `calc(${bottom}vh + 92px)`,
        }}
      >
        {isHeli.value ? (
          <div style={{ position: 'absolute' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="514"
              height="546"
              viewBox="0 0 514 546"
              className={styles.heli}
            >
              <path
                data-name="body"
                d="M-205,204.763v-67.5h-48.5v-27H-205v-94.5a26.691,26.691,0,0,1,.342-4.267C-234.589-6.919-256-56.038-256-113.738c0-73.454,34.7-133,77.5-133s77.5,59.547,77.5,133c0,57.7-21.412,106.819-51.342,125.234A26.685,26.685,0,0,1-152,15.763v94.5h48.5v27H-152v67.5a26.5,26.5,0,0,1-26.5,26.5A26.5,26.5,0,0,1-205,204.763Z"
                transform="translate(439 246.738)"
                fill="#ffffff69"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 512 512"
              className={styles.blade}
              style={{
                animationDuration: `${
                  rotorHealth.value > 0 ? bladeSpeed(fSpeed.value) : 0
                }s`,
              }}
            >
              <path
                d="M244,501V270H13a13,13,0,0,1,0-26H244V13a13,13,0,0,1,26,0V244H501a13,13,0,0,1,0,26H270V501a13,13,0,0,1-26,0Z"
                fill={
                  rotorHealth.value >= 300
                    ? '#fff'
                    : rotorHealth.value >= 100
                    ? 'rgb(249, 200, 109)'
                    : rotorHealth.value > 0
                    ? 'rgb(var(--color-red))'
                    : 'none'
                }
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="58"
              viewBox="0 0 13 58"
              className={styles.tail}
              style={{
                animationDuration: `${
                  tailHealth.value > 0 ? bladeSpeed(fSpeed.value) : 0
                }s`,
              }}
            >
              <rect
                width="13"
                height="58"
                rx="6.5"
                fill={
                  tailHealth.value >= 300
                    ? '#fff'
                    : tailHealth.value >= 100
                    ? 'rgb(249, 200, 109)'
                    : tailHealth.value > 0
                    ? 'rgb(var(--color-red))'
                    : 'none'
                }
              />
            </svg>
          </div>
        ) : isPlane.value ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="478"
              height="390"
              viewBox="0 0 478 390"
              className={styles.plane}
            >
              <path
                d="M-1035,179V151h-90v-.008c-9.986-.308-18-9.812-18-21.492,0-11.045,7.167-20.145,16.39-21.362l75.585-15.455L-1057,19.239V20l-9.391-2H-1069v-.556L-1228.847-16.6C-1248.232-20.015-1263-37.7-1263-59c0-23.748,18.356-43,41-43h153v-35c0-13.141,9.31-24.59,23.08-30.574q-.079-1.694-.08-3.426c0-22.091,9.85-40,22-40s22,17.908,22,40q0,1.731-.08,3.426C-988.31-161.589-979-150.141-979-137v35h153c22.643,0,41,19.251,41,43,0,21.3-14.768,38.985-34.152,42.4L-979,17.444V18h-2.609l-9.3,1.981-5.9,72.735,75.424,15.422c9.223,1.218,16.39,10.318,16.39,21.362,0,11.68-8.014,21.184-18,21.492V151h-89v28Z"
                transform="translate(1263 211)"
                fill="#ffffff69"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="156"
              height="20"
              viewBox="0 0 156 20"
              className={styles.propeller}
              style={{
                animationDuration: `${
                  rotorHealth.value ? bladeSpeed(fSpeed.value) : 0
                }s`,
              }}
            >
              <rect
                width="156"
                height="20"
                rx="10"
                fill={rotorHealth.value ? '#fff' : 'rgb(var(--color-red))'}
              />
            </svg>
          </>
        ) : (
          <img
            className={!seatbelt.value ? styles.warning : ''}
            style={drawSeatbelt.value ? {} : { animation: 'none', opacity: 0 }}
            src={Seatbelt}
            draggable={false}
          />
        )}
        <div
          className={styles.fuel}
          style={
            displayKnots.value && !isHeli.value && !isPlane.value
              ? {
                  bottom: '-57px',
                }
              : {}
          }
        >
          {fuelLevel.value > 5 && (
            <div
              className={styles.level}
              style={!(isHeli.value || isPlane.value) ? { bottom: '3px' } : {}}
            >
              <span
                style={{ height: `${Math.min(fuelLevel.value, 100)}%` }}
              ></span>
            </div>
          )}
          <img
            className={fuelLevel.value <= 5 ? styles.warning : ''}
            src={Fuel}
            draggable={false}
          />
        </div>
        {gearState.value !== -1 && (
          <div
            className={styles.gear}
            style={
              gearState.value == 1 || gearState.value == 3
                ? {
                    animation: `${styles['gear-flash']} 1s ease-in-out infinite`,
                  }
                : gearState.value == 4
                ? {
                    animation: `${styles['gear-disappear']} 1s ease-in-out forwards`,
                  }
                : {}
            }
          >
            <svg
              fill={gearState.value == 5 ? 'rgb(var(--color-red))' : '#fff'}
              width="800px"
              height="800px"
              viewBox="0 0 122.88 122.88"
            >
              <g>
                <path d="M61.44,21.74c10.96,0,20.89,4.44,28.07,11.63c7.18,7.18,11.63,17.11,11.63,28.07c0,10.96-4.44,20.89-11.63,28.07 c-7.18,7.18-17.11,11.63-28.07,11.63c-10.96,0-20.89-4.44-28.07-11.63c-7.18-7.18-11.63-17.11-11.63-28.07 c0-10.96,4.44-20.89,11.63-28.07C40.55,26.19,50.48,21.74,61.44,21.74L61.44,21.74z M61.44,0c16.97,0,32.33,6.88,43.44,18 c11.12,11.12,18,26.48,18,43.44c0,16.97-6.88,32.33-18,43.44c-11.12,11.12-26.48,18-43.44,18c-16.97,0-32.33-6.88-43.44-18 C6.88,93.77,0,78.41,0,61.44C0,44.47,6.88,29.11,18,18C29.11,6.88,44.47,0,61.44,0L61.44,0z M93.47,29.41 c-8.2-8.2-19.52-13.27-32.03-13.27c-12.51,0-23.83,5.07-32.03,13.27c-8.2,8.2-13.27,19.52-13.27,32.03 c0,12.51,5.07,23.83,13.27,32.03c8.2,8.2,19.52,13.27,32.03,13.27c12.51,0,23.83-5.07,32.03-13.27c8.2-8.2,13.27-19.52,13.27-32.03 C106.74,48.93,101.67,37.61,93.47,29.41L93.47,29.41z M65.45,56.77c-1.02-1.02-2.43-1.65-4.01-1.65c-1.57,0-2.99,0.63-4.01,1.65 l-0.01,0.01c-1.02,1.02-1.65,2.43-1.65,4.01c0,1.57,0.63,2.99,1.65,4.01l0.01,0.01c1.02,1.02,2.43,1.65,4.01,1.65 c1.57,0,2.99-0.63,4.01-1.65l0.01-0.01c1.02-1.02,1.65-2.44,1.65-4.01C67.1,59.21,66.47,57.8,65.45,56.77L65.45,56.77L65.45,56.77z M65.06,50.79c1.47,0.54,2.8,1.39,3.89,2.48l0,0l0,0c0.37,0.37,0.72,0.77,1.03,1.2l0.1-0.03l21.02-5.63 c-1.63-3.83-3.98-7.28-6.88-10.17c-5.03-5.03-11.72-8.41-19.17-9.24v21.12C65.07,50.61,65.07,50.7,65.06,50.79L65.06,50.79z M72.04,61.63c-0.14,1.73-0.69,3.35-1.57,4.76c0.05,0.06,0.09,0.13,0.13,0.2l12.07,19.13c0.54-0.47,1.06-0.96,1.57-1.47 c5.83-5.83,9.44-13.9,9.44-22.8c0-1.87-0.16-3.7-0.47-5.49L72.04,61.63L72.04,61.63z M64.57,70.95c-0.99,0.31-2.04,0.47-3.13,0.47 c-0.98,0-1.93-0.13-2.84-0.38L46.82,90.19c4.39,2.24,9.36,3.5,14.62,3.5c5.46,0,10.6-1.36,15.11-3.75L64.57,70.95L64.57,70.95z M52.57,66.64c-0.92-1.38-1.52-2.99-1.7-4.71l-0.01,0l-21.09-6.6c-0.38,1.98-0.58,4.02-0.58,6.11c0,8.9,3.61,16.97,9.44,22.8 c0.63,0.63,1.29,1.24,1.98,1.82l11.8-19.19C52.47,66.8,52.52,66.72,52.57,66.64L52.57,66.64z M52.72,54.72 c0.36-0.51,0.76-1,1.21-1.44l0,0l0,0c1.05-1.04,2.31-1.87,3.71-2.41c-0.01-0.11-0.02-0.23-0.02-0.34v-21.1 c-7.38,0.87-14,4.23-18.98,9.22c-2.75,2.75-5.01,6-6.63,9.6L52.72,54.72L52.72,54.72z" />
              </g>
            </svg>
            <p>{gearLabels[gearState.value]}</p>
          </div>
        )}
      </div>

      <div
        className={styles.speedometer}
        style={{
          left: `${left}vw`,
          bottom: `${bottom}vh`,
        }}
      >
        <div
          className={styles.speed}
          style={
            displayKnots.value
              ? {
                  left: '-16px',
                }
              : {}
          }
        >
          <h3>
            <span>{'0'.repeat(Math.max(3 - speed.value.length, 0))}</span>
            {speed.value.slice(-3)}
          </h3>
          <p>{displayKnots.value ? 'Knob' : 'KM/T'}</p>
          {typeof altitude.value == 'number' && (
            <div className={styles.altitude}>
              <img src={Altitude} draggable={false} />
              <div className={styles.inner}>
                <p className={styles.alt} style={{ marginBottom: 0 }}>
                  {Math.ceil(altitude.value).toString()}
                </p>
                <p style={{ marginTop: 0 }}>Fod</p>
              </div>
            </div>
          )}

          {displayKnots.value && (
            <div className={styles['wind-direction']}>
              <img
                src={Wind}
                draggable={false}
                style={{
                  // transform: `rotate(${Math.atan2(windDirection.value.y, windDirection.value.x) * 180 / Math.PI}deg)`
                  transform: `rotateX(${
                    35 + windDirection.value.y * 15
                  }deg) rotateZ(${windDirection.value.x * 70}deg)`,
                }}
              />
              <div>
                <p style={{ marginBottom: 0 }}>
                  {windDirection.value.speed.toFixed(1)}
                </p>
                <p style={{ marginTop: 0 }}>M/S</p>
              </div>
            </div>
          )}
        </div>

        {!displayKnots.value && (
          <div className={styles.radial}>
            <svg
              className={styles.dial}
              width="120"
              height="120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <circle
                  style={{
                    strokeDasharray:
                      235 +
                      180 *
                        Math.min(
                          (parseInt(speed.value) / maxSpeed.value) * 0.6,
                          1
                        ),
                    stroke: `hsl(195, 100%, ${
                      100 -
                      ((58 * parseInt(speed.value)) / maxSpeed.value) * 0.7
                    }%)`,
                  }}
                  r="55"
                  cy="125px"
                  cx="50%"
                  strokeWidth="6"
                  stroke="#fff"
                  fill="none"
                />
              </g>
            </svg>
            <svg
              className={styles['radial-bg']}
              width="120"
              height="120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <circle
                  r="55"
                  cy="125px"
                  cx="50%"
                  strokeWidth="6"
                  stroke="#fff"
                  fill="none"
                />
              </g>
            </svg>
          </div>
        )}

        {/* <input type="range" min={0} max={maxSpeed.value} style={{ position: 'absolute', left: '80px' }} onChange={e => speed.value = e.target.value} /> */}
      </div>
    </>
  )
}

export default Speedometer
