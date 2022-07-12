export interface FooterProps {
  /** Function that, when called without arguments, opens the consent manager. */
  openConsentManager?: () => void
  /** Optional className for margin addition */
  className?: string
}

/**
 * NOTE: a FooterItem with type = 'link' should include an `href` property.
 */
export interface FooterItem {
  href?: string
  text: string
  type: 'link' | 'consent-manager'
}
