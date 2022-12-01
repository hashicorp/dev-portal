import BaseNewLayout from 'layouts/base-new'
import { CertificationLandingProps } from './types'
import {
	CertificationsContentArea,
	CertificationsHero,
	CertificationsNav,
} from '../components'

function CertificationsLandingView({
	navProps,
	pageContent,
}: CertificationLandingProps) {
	return (
		<>
			<CertificationsNav {...navProps} />
			<CertificationsContentArea>
				<CertificationsHero
					heading="Certifications headline"
					description="As a Cloud Engineer specializing in DevOps, IT, Security, or Development, you can use the HashiCorp certification program to earn formal, industry accepted credentials that validate your technical knowledge. Each certification program tests both conceptual knowledge and real-world experience using HashiCorp multi-cloud tools. Upon passing the exam, you can easily communicate your proficiency and employers can quickly verify your results.
"
				/>
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

CertificationsLandingView.layout = BaseNewLayout
export default CertificationsLandingView
