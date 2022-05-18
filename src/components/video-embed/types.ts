import { ReactPlayerProps } from 'react-player'

/**
 * For ReactPlayerProps documentation, see:
 * https://github.com/CookPete/react-player#props
 */
export interface VideoEmbedProps extends ReactPlayerProps {
  /**
   * URL for the video. Unlike in ReactPlayerProps, which has a flexible type,
   * for our purposes, this must be a string
   */
  url: string
  /**
   * Optional starting time for the video. Works with YouTube and Wistia video URLS.
   */
  start?: number
}

/**
 * Inner component contains hooks for percent played,
 * we wrap this inner component to implement the analytics we want.
 */
export interface VideoEmbedInnerProps extends VideoEmbedProps {
  /**
   * Callback fired when the % watched of the video changes,
   * based on what percentage of timestamps have been played.
   */
  percentPlayedCallback?: (percentPlayed: number) => void
  /**
   * Optionally only call percentPlayedCallback when specific
   * percentage milestones are reached
   */
  percentPlayedMilestones?: number[]
}

/**
 * An object representing the video state,
 * used for progress tracking callbacks
 */
export interface PlayState {
  position: number
  isPlaying: boolean
  duration?: number
}

/**
 * A tuple representing the start and end times
 * of an interval in the video, used for progress tracking
 */
export type SegmentPlayed = [number, number]

/**
 * An event representing the starting or stopping
 * of video playback, used for progress tracking
 */
export interface StartStopEvent {
  type: 'start' | 'stop'
  timestamp: number
}
