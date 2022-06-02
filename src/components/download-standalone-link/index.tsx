import { ReactElement } from 'react'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconDownload24 } from '@hashicorp/flight-icons/svg-react/download-24'
import { DownloadStandaloneLinkProps } from './types'
import MobileStandaloneLink from 'components/mobile-standalone-link'

const DownloadStandaloneLink = ({
  ariaLabel,
  href,
  onClick,
}: DownloadStandaloneLinkProps): ReactElement => (
  <MobileStandaloneLink
    ariaLabel={ariaLabel}
    download
    href={href}
    size16Icon={<IconDownload16 />}
    size24Icon={<IconDownload24 />}
    iconPosition="trailing"
    onClick={onClick}
    text="Download"
  />
)

export default DownloadStandaloneLink
