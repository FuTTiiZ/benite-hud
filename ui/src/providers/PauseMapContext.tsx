import React from 'react'

import { signal } from '@preact/signals-react'
import { useNuiEvent } from '@hooks/useNuiEvent'

const pauseMapOpen = signal<boolean>(true)
export const PauseMapContext = React.createContext<boolean>(pauseMapOpen.value)

export const PauseMapProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useNuiEvent(
    'updatePauseMapOpen',
    ({ open }: { open: boolean }) => (pauseMapOpen.value = open)
  )

  return (
    <PauseMapContext.Provider value={pauseMapOpen.value}>
      {children}
    </PauseMapContext.Provider>
  )
}
