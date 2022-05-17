import { ReactPlayerProps } from 'react-player'

/**
 * For ReactPlayerProps documentation, see:
 * https://github.com/CookPete/react-player#props
 */
export interface VideoEmbedProps extends ReactPlayerProps {
  /**
   * Optional starting time for the video. Works with YouTube and Wistia video URLS.
   */
  start?: number
  /**
   * [Development] callback fired when the % watched of the video changes,
   * based on absolute cumulative time between "play" and "stop" events.
   */
  onWatchProgress?: (
    video_url: string,
    video_progress: number // 1 | 25 | 50 | 75 | 90
  ) => void
}

/**
 * A tuple representing the start and end times
 * of an interval in the video
 * TODO: make object?
 */
export type SegmentPlayed = [number, number]

/**
 * An event representing the starting or stopping
 * of video playback
 */
export interface StartStopEvent {
  type: 'start' | 'stop'
  timestamp: number
}

/**
 * An object representing the video state
 */
export interface PlayState {
  position: number
  isPlaying: boolean
  duration?: number
}
