import { CertificationLandingProps } from './types'

function CertificationsLandingView({ pageContent }: CertificationLandingProps) {
	return (
		<pre style={{ border: '1px solid magenta' }}>
			<code>
				{JSON.stringify(
					{ note: 'Landing page placeholder', pageContent },
					null,
					2
				)}
			</code>
		</pre>
	)
}

export default CertificationsLandingView
