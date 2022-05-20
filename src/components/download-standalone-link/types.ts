import { StandaloneLinkProps } from 'components/standalone-link'

export interface DownloadStandaloneLinkProps {
  /**
   * A non-visual accessible and descriptive label for what's being downloaded.
   */
  ariaLabel: StandaloneLinkProps['ariaLabel']

  /**
   * The location of the file to download. Passedd directly to the internally
   * rendered `StandaloneLink`.
   */
  href: StandaloneLinkProps['href']

  /**
   * A callback function to invoke when the `<a>` element  clicked.
   */
  onClick?: StandaloneLinkProps['onClick']
}
