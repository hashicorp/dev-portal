import { CertificationLandingProps } from './types'
import { CertificationsNav } from '../components'

export function CertificationsLandingView({
	navProps,
	pageContent,
}: CertificationLandingProps) {
	return (
		<>
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
		</>
	)
}
