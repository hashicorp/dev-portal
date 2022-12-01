import BaseNewLayout from 'layouts/base-new'
import {
	CertificationsContentArea,
	CertificationsNav,
	CertificationsHero,
} from '../components'
import { CertificationPageProps } from './types'

function CertificationPage({ navProps, pageContent }: CertificationPageProps) {
	return (
		<>
			<CertificationsNav {...navProps} />
			<CertificationsContentArea>
				<CertificationsHero
					heading={pageContent.title}
					description={pageContent.heroIntro}
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

CertificationPage.layout = BaseNewLayout
export default CertificationPage
