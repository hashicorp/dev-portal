/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'
import Link from 'next/link'

export default function Footer({ openConsentManager }) {
	return (
		<footer className={s.root}>
			<div className="g-grid-container">
				<Link href="/intro">Intro</Link>
				<Link href="/docs">Docs</Link>
				<a href="https://www.amazon.com/gp/product/1449335837/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1449335837&linkCode=as2&tag=vagrant-20">
					Book
				</a>
				<Link href="/docs/providers/vmware">VMware</Link>
				<a href="https://hashicorp.com/privacy">Privacy</a>
				<Link href="/security">Security</Link>
				<Link href="/files/press-kit.zip">Press Kit</Link>
				<a onClick={openConsentManager}>Consent Manager</a>
			</div>
		</footer>
	)
}
