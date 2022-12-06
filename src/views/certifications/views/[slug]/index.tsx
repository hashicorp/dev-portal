// Global
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
			<CertificationProgramDetails title="Terraform Associate 002" />
			<CertificationProgramDetails title="Terraform Associate 003" />
			<CertificationsContentArea>
				<h2>{`[stub]`} Page Content</h2>
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
			</CertificationsContentArea>
		</>
	)
}

CertificationPage.layout = BaseNewLayout
export default CertificationPage
