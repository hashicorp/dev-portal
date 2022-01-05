import React from 'react'
import classNames from 'classnames'
import s from './style.module.css'

interface FooterProps {
  /** Function that, when called without arguments, opens the consent manager. */
  openConsentManager?: () => void
  /** Optional className for margin addition */
  className?: string
}

function Footer({
  openConsentManager,
  className,
}: FooterProps): React.ReactElement {
  return (
    <footer className={classNames(s.root, className)}>
      Dev Portal Footer Placeholder{' '}
      {typeof openConsentManager == 'function' && (
        <button onClick={openConsentManager}>Open Consent Manager</button>
      )}
    </footer>
  )
}

export default Footer
