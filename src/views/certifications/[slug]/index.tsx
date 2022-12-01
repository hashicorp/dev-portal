import BaseNewLayout from 'layouts/base-new'
import { CertificationsNav } from '../components'
import { CertificationsContentArea } from '../components/certifications-content-area'
import { CertificationPageProps } from './types'

function CertificationPage({ navProps, pageContent }: CertificationPageProps) {
	return (
		<>
			<CertificationsContentArea>
				<h1>{pageContent.title}</h1>
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

CertificationPage.layout = BaseNewLayout
export default CertificationPage
