import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export async function fetchNavData(
	product: string, //: string, // waypoint
	basePath: string, //: string, // commands | docs | plugins
	version: string //: string // v0.5.x
): Promise<any> {
	const fullPath = `nav-data/${version}/${basePath}`
	const url = `https://content.hashicorp.com/api/content/${product}/${fullPath}`

	const response = await fetch(url)

	if (response.status !== 200) {
		throw new Error(
			`[ContentApiError - ${response.status}] Failed to fetch: ${url}`
		)
	}

	const { result } = await response.json()
	return result
}

export const getWaypointDocs = async () => {
	return fetchNavData('waypoint', 'docs', 'v0.9.x')
}

const ReactQueryTestPage1 = () => {
	const { data } = useQuery(['waypoint-docs'])

	return (
		<>
			<h1>Waypoint /docs nav data</h1>
			<p>This page loads the /docs nav data for Waypoint v0.9.x</p>
			<Link href="/test/react-query-2">
				<a>Go to other test page that uses this data</a>
			</Link>
			<pre>
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre>
		</>
	)
}

const getStaticProps = async () => {
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery(['waypoint-docs'], getWaypointDocs, {
		staleTime: 10000,
	})

	return {
		props: { dehydratedState: dehydrate(queryClient) },
	}
}

export { getStaticProps }
export default ReactQueryTestPage1
