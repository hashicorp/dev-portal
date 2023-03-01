/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Link from 'next/link'

export default function Footer({ openConsentManager }) {
	return (
		<footer className="g-footer">
			<div className="g-grid-container">
				<div className="left">
					<Link href="/intro">Intro</Link>
					<Link href="/docs/guides">Guides</Link>
					<Link href="/docs">Docs</Link>
					<Link href="/community">Community</Link>
					<a href="https://hashicorp.com/privacy">Privacy</a>
					<Link href="/security">Security</Link>
					<Link href="https://www.hashicorp.com/brand">Brand</Link>
					<a onClick={openConsentManager}>Consent Manager</a>
				</div>
			</div>
		</footer>
	)
}
