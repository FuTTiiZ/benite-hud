import { PauseMapContext } from '@providers/PauseMapContext'
import { useContext } from 'react'

export const usePauseMap = () => useContext<boolean>(PauseMapContext)
