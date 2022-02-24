import { StandaloneLinkProps } from 'components/standalone-link'

export interface DownloadStandaloneLinkProps {
  /**
   * A non-visual accessible and descriptive label for what's being downloaded.
   */
  ariaLabel: string

  /**
   * The location of the file to download. Passedd directly to the internally
   * rendered `StandaloneLink`.
   */
  href: StandaloneLinkProps['href']

  /**
   * Same as the `StandaloneLink` `textSize` prop and passed directly to the
   * internally rendered `StandaloneLink`.
   */
  textSize?: StandaloneLinkProps['textSize']
}
