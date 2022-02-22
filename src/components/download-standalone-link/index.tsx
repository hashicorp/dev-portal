import { ReactElement } from 'react'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import StandaloneLink from 'components/standalone-link'
import { DownloadStandaloneLinkProps } from './types'

const DownloadStandaloneLink = ({
  ariaLabel,
  href,
}: DownloadStandaloneLinkProps): ReactElement => (
  <StandaloneLink
    ariaLabel={ariaLabel}
    download
    href={href}
    icon={<IconDownload16 />}
    iconPosition="trailing"
    text="Download"
  />
)

export default DownloadStandaloneLink
