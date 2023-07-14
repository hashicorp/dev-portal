/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import SentinelIoLayout from 'layouts/_proxied-dot-io/sentinel'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import s from './style.module.css'

export async function getStaticProps() {
	return await generateStaticProps('sentinel')
}

export default function SentinelDownloadsPage(props) {
	return (
		<SentinelIoLayout {...props.layoutProps}>
			<ProductDownloadsPage
				logo={<p className={s.notALogo}>Sentinel</p>}
				changelog="/sentinel/changelog"
				getStartedLinks={[
					{
						label: 'Installation Instructions',
						href: '/sentinel/intro/getting-started/install',
					},
					{
						label: 'Community Resources',
						href: 'https://discuss.hashicorp.com/c/sentinel/',
					},
				]}
				packageManagerOverrides={[
					// Note: Duplicate Homebrew entries target
					// both macOS and Linux. If one is removed,
					// then Homebrew will show up under the Linux tab.
					{
						label: 'Homebrew',
						os: 'NONE--IGNORE',
					},
					{
						label: 'Homebrew',
						os: 'NONE--IGNORE',
					},
					{
						label: 'Amazon Linux',
						os: 'NONE--IGNORE',
					},
					{
						label: 'Fedora',
						os: 'NONE--IGNORE',
					},
					{
						label: 'Ubuntu/Debian',
						os: 'NONE--IGNORE',
					},
					{
						label: 'CentOS/RHEL',
						os: 'NONE--IGNORE',
					},
				]}
				{...props}
			/>
		</SentinelIoLayout>
	)
}
