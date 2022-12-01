import Link from 'next/link'

export default function Footer({ openConsentManager }) {
	return (
		<footer className="g-footer">
			<div className="g-grid-container">
				<div className="left">
					<Link href="/docs">Docs</Link>
					<a href="https://developer.hashicorp.com/boundary/tutorials">
						Tutorials
					</a>
					<a href="https://hashicorp.com/privacy">Privacy</a>
					<Link href="/security">Security</Link>
					<a href="/files/press-kit.zip">Press Kit</a>
					<a onClick={openConsentManager}>Consent Manager</a>
				</div>
			</div>
		</footer>
	)
}
