import React from 'react'
import s from './style.module.css'

interface FooterProps {
  /** Function that, when called without arguments, opens the consent manager. */
  openConsentManager: () => void
}

function Footer({ openConsentManager }: FooterProps): React.ReactElement {
  return (
    <footer className={s.placeholder}>
      Dev Portal Footer Placeholder{' '}
      <button onClick={openConsentManager}>Open Consent Manager</button>
    </footer>
  )
}

export default Footer
