import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

const ReactQueryTestPage2 = () => {
	const { data } = useQuery(['waypoint-docs'])

	return (
		<>
			<h1>Waypoint /docs nav data</h1>
			<p>
				This page does not load the /docs nav data for Waypoint v0.9.x, but
				instead consumes it with <code>{"`useQuery(['waypoint-docs'])`"}</code>.
				The data is present when navigating here from{' '}
				<Link href="/test/react-query-1">
					<a>/test/react-query-1</a>
				</Link>
			</p>
			<pre>
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre>
		</>
	)
}

export default ReactQueryTestPage2
