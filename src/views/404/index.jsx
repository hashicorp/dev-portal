import { useErrorPageAnalytics } from '@hashicorp/platform-analytics'
import Link from 'components/link'
import s from './404.module.css'

export default function NotFound() {
	useErrorPageAnalytics(404)

	return (
		<div className={s.root}>
			<h1 className="g-type-display-1">Page Not Found</h1>
			<p>
				We&apos;re sorry but we can&apos;t find the page you&apos;re looking
				for.
			</p>
			<p>
				<Link href="/">Back to Home</Link>
			</p>
		</div>
	)
}
