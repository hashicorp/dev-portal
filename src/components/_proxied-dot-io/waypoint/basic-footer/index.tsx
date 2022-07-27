import Link from 'next/link'
import s from './style.module.css'

export default function Footer({ openConsentManager }) {
	return (
		<footer className={s.footer}>
			<div className={s.inner}>
				<div className={s.content}>
					<div className={s.left}>
						<Link href="/docs">
							<a>Docs</a>
						</Link>
						<a href="https://learn.hashicorp.com/waypoint">Learn</a>
						<a href="https://www.hashicorp.com/terms-of-service">
							Terms of Service
						</a>
						<a href="https://hashicorp.com/privacy">Privacy</a>
						<Link href="/security">
							<a>Security</a>
						</Link>
						<a href="/files/press-kit.zip">Press Kit</a>
						<a onClick={openConsentManager}>Consent Manager</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
