import path from 'path'
import { readLocalFile } from 'lib/read-local-file'
import { GetStaticPropsResult } from 'next'
import { CertificationLandingProps } from './types'
import { getFaqsFromMdx } from 'views/certifications/content/utils'
import { LandingPageSchema } from 'views/certifications/content/schemas/landing-page'

const CONTENT_DIR = 'src/content/certifications'

/**
 * Read in local content from the filesystem.
 */
export async function getStaticProps(): Promise<
	GetStaticPropsResult<CertificationLandingProps>
> {
	/**
	 * Ensure the authored content matches our expected schema
	 */
	const contentString = readLocalFile(path.join(CONTENT_DIR, 'landing.json'))
	const pageContent = LandingPageSchema.parse(JSON.parse(contentString))
	/**
	 * Parse landing page FAQs from an MDX file
	 */
	const faqMdxString = readLocalFile(path.join(CONTENT_DIR, 'landing-faq.mdx'))
	const faqItems = await getFaqsFromMdx(faqMdxString)
	/**
	 * Return static props
	 */
	return {
		props: { pageContent, faqItems },
	}
}
