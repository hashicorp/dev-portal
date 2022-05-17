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
    // video_url: string,
    video_progress: number // 1 | 25 | 50 | 75 | 90
  ) => void
  /**
   * [Development] callback fired when the % watched of the video changes,
   * based on the current timestamp in the video vs the duration
   */
  onWatchProgressSimple?: (
    // video_url: string,
    video_progress: number // 1 | 25 | 50 | 75 | 90
  ) => void
}
