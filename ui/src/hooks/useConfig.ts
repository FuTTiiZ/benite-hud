import { Signal } from '@preact/signals-react'
import { HUDConfig } from '@customTypes/types'

import { ConfigContext } from '@providers/ConfigContext'
import { useContext } from 'react'

export const useConfig = () => useContext<Signal<HUDConfig>>(ConfigContext)
