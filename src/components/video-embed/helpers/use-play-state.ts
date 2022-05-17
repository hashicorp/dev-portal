import { Dispatch, SetStateAction, useState } from 'react'
import { PlayState } from '../types'

export function usePlayState(): [
  PlayState,
  {
    setDuration: (duration: number) => void
    setPosition: (position: number) => void
    setPlaying: () => void
    setStopped: () => void
  }
] {
  const [playState, setPlayState] = useState<PlayState>({
    position: 0,
    isPlaying: false,
  })

  function setDuration(duration: number) {
    setPlayState((prev: PlayState) => ({ ...prev, duration }))
  }

  function setPosition(position: number) {
    setPlayState((prev: PlayState) => ({ ...prev, position }))
  }

  function setPlaying() {
    setPlayState((prev: PlayState) => ({ ...prev, isPlaying: true }))
  }

  function setStopped() {
    setPlayState((prev: PlayState) => ({ ...prev, isPlaying: false }))
  }

  return [playState, { setDuration, setPosition, setPlaying, setStopped }]
}
