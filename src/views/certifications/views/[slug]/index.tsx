import { CertificationProgramViewProps } from './types'

function CertificationProgramView({
	pageContent,
	slug,
}: CertificationProgramViewProps) {
	return (
		<pre style={{ border: '1px solid magenta' }}>
			<code>
				{JSON.stringify(
					{ note: 'Program page placeholder', slug, pageContent },
					null,
					2
				)}
			</code>
		</pre>
	)
}

export default CertificationProgramView
