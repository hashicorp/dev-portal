// Global
import { ReactNode } from 'react'
import BaseNewLayout from 'layouts/base-new'
// Shared view components
import {
	CertificationsContentArea,
	CertificationsNav,
	CertificationsHero,
} from '../../components'
// Local view components
import { CertificationProgramDetails } from './components'
import { CertificationPageProps } from './types'

function CertificationPage({ navProps, pageContent }: CertificationPageProps) {
	return (
		<>
			<CertificationsNav {...navProps} />
			<CertificationsHero
				heading={pageContent.hero.heading}
				description={pageContent.hero.description}
			/>
			{pageContent.certifications.map((certification) => {
				return (
					<CertificationProgramDetails
						key={certification.title}
						title={certification.title}
						description={certification.description}
						links={certification.links}
						faqItems={certification.faqItems.map((item) => {
							return {
								title: item.title,
								mdxSource: item.mdxSource,
							}
						})}
					/>
				)
			})}
			{/* <CertificationsContentArea>
				<h2>{`[dev]`} Content Debug</h2>
				<pre
					className="hds-typography-code-100"
					style={{
						whiteSpace: 'pre-wrap',
						background: '#EEEEEE',
						padding: '2rem',
					}}
				>
					<code>{JSON.stringify({ pageContent }, null, 2)}</code>
				</pre>
			</CertificationsContentArea> */}
		</>
	)
}

CertificationPage.layout = BaseNewLayout
export default CertificationPage
