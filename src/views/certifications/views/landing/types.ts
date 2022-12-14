import { RawLandingPageContent } from 'views/certifications/content/schemas/landing-page'
import { FaqItem } from 'views/certifications/types'

export interface CertificationLandingProps {
	/**
	 * Content for the hero on the landing page.
	 */
	pageContent: RawLandingPageContent

	/**
	 * FAQ items to render on the landing page.
	 */
	faqItems: FaqItem[]
}
