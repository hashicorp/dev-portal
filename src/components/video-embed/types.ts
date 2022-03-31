import { ReactPlayerProps } from 'react-player'

export interface VideoEmbedProps extends ReactPlayerProps {
  /**
   * Optional starting time for the video. Works with YouTube and Wistia video URLS.
   */
  start?: number
}
