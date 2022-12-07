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
				heading={pageContent.title}
				description={
					'Brief intro. Short but enough to help practitioners take that next step. Suggestion is a max of 5 lines of content. Verify your basic infrastructure automation skills. If you have passed the Terraform Associate wait until the new version comes out to re-certify.'
				}
			/>
			{pageContent.certifications.map((certification) => {
				return (
					<CertificationProgramDetails
						key={certification.title}
						title={certification.title}
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
