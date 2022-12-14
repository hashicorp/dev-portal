// Global
import BaseNewLayout from 'layouts/base-new'
// Local view
import { LandingHero } from './components'
import { CertificationLandingProps } from './types'

function CertificationsLandingView({
	pageContent,
	faqItems,
}: CertificationLandingProps) {
	const { hero } = pageContent
	return (
		<>
			<LandingHero heading={hero.heading} description={hero.description} />
			<pre style={{ border: '1px solid magenta' }}>
				<code>
					{JSON.stringify(
						{ note: 'Landing page placeholder', pageContent, faqItems },
						null,
						2
					)}
				</code>
			</pre>
		</>
	)
}

CertificationsLandingView.layout = BaseNewLayout
export default CertificationsLandingView
