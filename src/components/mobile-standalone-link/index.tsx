import StandaloneLink from 'components/standalone-link'
import { MobileStandaloneLinkProps } from './types'
import s from './mobile-standalone-link.module.css'

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
  return (
    <StandaloneLink
      {...rest}
      icon={
        <>
          <span className={s.notMobileIcon}>{size16Icon}</span>
          <span className={s.mobileIcon}>{size24Icon}</span>
        </>
      }
      text={text}
      textClassName={s.text}
    />
  )
}

export type { MobileStandaloneLinkProps }
export default MobileStandaloneLink
