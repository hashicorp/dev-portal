// Global
import BaseNewLayout from 'layouts/base-new'
// Local
import { ProgramHero } from './components'
import { CertificationProgramViewProps } from './types'

function CertificationProgramView({
	pageContent,
	slug,
}: CertificationProgramViewProps) {
	const { hero } = pageContent

	return (
		<>
			<ProgramHero
				heading={hero.heading}
				description={hero.description}
				slug={slug}
			/>
			<pre style={{ border: '1px solid magenta' }}>
				<code>
					{JSON.stringify(
						{ note: 'Program page placeholder', slug, pageContent },
						null,
						2
					)}
				</code>
			</pre>
		</>
	)
}

CertificationProgramView.layout = BaseNewLayout
export default CertificationProgramView
