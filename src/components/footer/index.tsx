import React from 'react'
import svgHashicorpLogo from '!!raw-loader!./svg/hashicorp-logo.svg'
import MaybeInternalLink from 'components/maybe-internal-link'
import InlineSvg from '@hashicorp/react-inline-svg'
import classNames from 'classnames'
import s from './style.module.css'

interface FooterProps {
  /** Function that, when called without arguments, opens the consent manager. */
  openConsentManager?: () => void
  /** Optional className for margin addition */
  className?: string
  /** Optional flag to enable docs-layout friendly styles */
  styleForDocsLayout?: boolean
}

function Footer({
  openConsentManager,
  className,
  styleForDocsLayout,
}: FooterProps): React.ReactElement {
  return (
    <footer
      className={classNames(s.root, className, {
        [s.styleForDocsLayout]: styleForDocsLayout,
      })}
    >
      <InlineSvg className={s.logo} src={svgHashicorpLogo} />
      <ul className={s.links}>
        <li className={s.linkListItem}>
          <MaybeInternalLink
            className={s.linkAction}
            href="https://status.hashicorp.com"
          >
            System status
          </MaybeInternalLink>
        </li>
        {typeof openConsentManager == 'function' && (
          <li className={s.linkListItem}>
            <button className={s.linkAction} onClick={openConsentManager}>
              Cookie Manager
            </button>
          </li>
        )}
        <li className={s.linkListItem}>
          <MaybeInternalLink
            className={s.linkAction}
            href="https://www.hashicorp.com/terms-of-service"
          >
            Terms of use
          </MaybeInternalLink>
        </li>
        <li className={s.linkListItem}>
          <MaybeInternalLink
            className={s.linkAction}
            href="https://www.hashicorp.com/security"
          >
            Security
          </MaybeInternalLink>
        </li>
        <li className={s.linkListItem}>
          <MaybeInternalLink
            className={s.linkAction}
            href="https://www.hashicorp.com/privacy"
          >
            Privacy
          </MaybeInternalLink>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
