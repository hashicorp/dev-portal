import { rivetClient } from 'lib/cms'
import query from './query.graphql'

interface CertificationLandingProps {
	/**
	 * Should update this based on adjacent query.graphql.
	 * Might be nice time for me to try out Zod, write a schema instead of types,
	 * but then also get the types for free?
	 */
	datoContent: $TSFixMe
}

function CertificationsLanding({ datoContent }: CertificationLandingProps) {
	return (
		<>
			<h1>Certifications Landing</h1>
			<pre>
				<code>{JSON.stringify({ datoContent }, null, 2)}</code>
			</pre>
		</>
	)
}

/**
 * Note: starting by fetching Dato content for now, because it's what we have
 * so far, and lists all sub-pages too. Could pull down and write into JSON
 * or YAML files or whatnot if we'd prefer to have it local to dev dot.
 */
export async function getStaticProps() {
	const rivetQuery = rivetClient({})
	const datoContent = await rivetQuery({
		query: query,
	})

	return {
		props: {
			datoContent,
		},
	}
}

export default CertificationsLanding
