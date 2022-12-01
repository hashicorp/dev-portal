import BaseNewLayout from 'layouts/base-new'
import { CertificationLandingProps } from './types'
import { CertificationsNav } from '../components'
import { CertificationsContentArea } from '../components/certifications-content-area'

function CertificationsLandingView({
	navProps,
	pageContent,
}: CertificationLandingProps) {
	return (
		<>
			<CertificationsContentArea>
				<h1>Certifications</h1>
				<CertificationsNav {...navProps} />
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
