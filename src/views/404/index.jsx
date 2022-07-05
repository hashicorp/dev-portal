import Link from 'next/link'
import { useEffect } from 'react'
import s from './404.module.css'

export default function NotFound() {
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			typeof window?.analytics?.track === 'function' &&
			typeof window?.document?.referrer === 'string' &&
			typeof window?.location?.href === 'string'
		) {
			window.analytics.track(window.location.href, {
				category: '404 Response',
				label: window.document.referrer || 'No Referrer',
			})
		}
	}, [])

	return (
		<div className={s.root}>
			<h1 className="g-type-display-1">Page Not Found</h1>
			<p>
				We&apos;re sorry but we can&apos;t find the page you&apos;re looking
				for.
			</p>
			<p>
				<Link href="/">
					<a>Back to Home</a>
				</Link>
			</p>
		</div>
	)
}
