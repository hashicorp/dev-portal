import Link from 'next/link'
import { useErrorPageAnalytics } from '@hashicorp/platform-analytics'

export default function NotFound() {
	useErrorPageAnalytics(404)

	return (
		<main id="p-404">
			<h1 className="g-type-display-1">Page Not Found</h1>
			<p>
				We&lsquo;re sorry but we can&lsquo;t find the page you&lsquo;re looking
				for.
			</p>
			<p>
				<Link href="/">
					<a>Back to Home</a>
				</Link>
			</p>
		</main>
	)
}
