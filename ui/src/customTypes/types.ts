declare global {
  interface Window {
    GetParentResourceName: () => string
    invokeNative: (native: string, ...args: unknown[]) => unknown
  }
}

export type MinimapData = {
  [key: string]: number

  x: number
  y: number
  width: number
  height: number
}

export type HUDConfig = {
  stickyAccounts: boolean
  stickyInfo: boolean
  compass: boolean
  minimapOffsetX: number
  minimapOffsetY: number
}
export type HUDConfigProp = keyof HUDConfig
