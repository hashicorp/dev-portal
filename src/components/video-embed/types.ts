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
}
