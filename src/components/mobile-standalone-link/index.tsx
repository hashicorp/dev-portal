import { useDeviceSize } from 'contexts'
import StandaloneLink from 'components/standalone-link'
import { MobileStandaloneLinkProps } from './types'

/**
 * Handles rendering different content based on whether or not the current
 * viewport is at a mobile width.
 */
const MobileStandaloneLink = ({
  size16Icon,
  size24Icon,
  text,
  ...rest
}: MobileStandaloneLinkProps) => {
  const { isMobile } = useDeviceSize()

  // Use a larger icon if we're at mobile width
  let icon = size16Icon
  if (isMobile) {
    icon = size24Icon
  }

  // Don't render with text if we're at a mobile width
  let linkText
  if (!isMobile) {
    linkText = text
  }

  return <StandaloneLink {...rest} icon={icon} text={linkText} />
}

export type { MobileStandaloneLinkProps }
export default MobileStandaloneLink
