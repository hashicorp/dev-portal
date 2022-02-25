import { ReactElement } from 'react'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import StandaloneLink from 'components/standalone-link'
import { DownloadStandaloneLinkProps } from './types'

const DownloadStandaloneLink = ({
  ariaLabel,
  href,
  textSize = 200,
}: DownloadStandaloneLinkProps): ReactElement => (
  <StandaloneLink
    ariaLabel={ariaLabel}
    download
    href={href}
    icon={<IconDownload16 />}
    iconPosition="trailing"
    text="Download"
    textSize={textSize}
  />
)

export default DownloadStandaloneLink
