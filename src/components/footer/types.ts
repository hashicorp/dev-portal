export interface FooterProps {
	/** Function that, when called without arguments, opens the consent manager. */
	openConsentManager?: () => void
	/** Optional className for margin addition */
	className?: string
}

/**
 * NOTE: a FooterItem with type = 'link' should include an `href` property.
 */
interface FooterLinkItem {
	text: string
	href: string
	opensInNewTab?: boolean
}

/**
 * Footer items can either be links, or a consent-manager activator button.
 */
export type FooterItem =
	| ({ type: 'link' } & FooterLinkItem)
	| ({ type: 'consent-manager' } & { text: string })
