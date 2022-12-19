import Link from 'next/link'

export default function Footer({ openConsentManager }) {
	return (
		<footer className="g-footer">
			<div className="g-grid-container">
				<div className="left">
					<Link href="/docs">Docs</Link>
					<Link href="/api">API</Link>
					<a href="https://developer.hashicorp.com/vault/tutorials">
						Tutorials
					</a>
					<Link href="/community">Community</Link>
					<a href="https://hashicorp.com/privacy">Privacy</a>
					<Link href="/security">Security</Link>
					<Link href="/files/press-kit.zip">Press Kit</Link>
					<a onClick={openConsentManager}>Consent Manager</a>
				</div>
			</div>
		</footer>
	)
}
