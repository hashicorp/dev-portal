import { useRouter } from 'next/router'
import Head from 'next/head'
import { getVersionFromPath } from 'lib/get-version-from-path'

export function NoIndexTagIfVersioned() {
	const { asPath } = useRouter()
	const versionInPath = getVersionFromPath(asPath)

	if (versionInPath) {
		return (
			<Head>
				<meta name="robots" content="noindex, nofollow" key="robots" />
			</Head>
		)
	}

	return null
}
