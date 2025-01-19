import React from 'react'

import { HUDConfig } from '@customTypes/types'

import { Signal, signal } from '@preact/signals-react'

const config = signal<HUDConfig>({
  stickyAccounts: false,
  stickyInfo: false,
  compass: false,
  minimapOffsetX: 0,
  minimapOffsetY: 0,
})
export const ConfigContext = React.createContext<Signal<HUDConfig>>(config)

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
