/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Subnav from '@hashicorp/react-subnav'
import { isInUS } from '@hashicorp/platform-util/geo'
import classNames from 'classnames'
import useProxiedPath from 'lib/hooks/useProxiedPath'
import { useFlagBag } from 'flags/client'
import Link from 'next/link'
import s from './style.module.css'

export default function ProductSubnav({ menuItems }) {
	const { asPath } = useProxiedPath()
	const flagBag = useFlagBag()
	const classnames = classNames(
		'g-product-subnav',
		s.subnav,
		flagBag.settled && s.settled,
		flagBag.flags?.tryForFree ? s.control : s.variant
	)

	if (isInUS()) {
		return (
			<Subnav
				className={classnames}
				hideGithubStars={true}
				titleLink={{
					text: 'HashiCorp Vault',
					url: '/',
				}}
				ctaLinks={[
					{
						text: 'GitHub',
						url: 'https://www.github.com/hashicorp/vault',
					},
					{
						text: 'Download',
						url: 'https://developer.hashicorp.com/vault/downloads',
					},
					{
						text:
							flagBag.settled && flagBag.flags.tryForFree
								? 'Try for free'
								: 'Try HCP Vault',
						url: 'https://portal.cloud.hashicorp.com/sign-up',
						theme: {
							brand: 'vault',
						},
					},
				]}
				currentPath={asPath}
				menuItems={menuItems}
				menuItemsAlign="right"
				constrainWidth
				matchOnBasePath
				Link={Link}
			/>
		)
	}

	return (
		<Subnav
			className={'g-product-subnav'}
			hideGithubStars={true}
			titleLink={{
				text: 'HashiCorp Vault',
				url: '/',
			}}
			ctaLinks={[
				{
					text: 'GitHub',
					url: 'https://www.github.com/hashicorp/vault',
				},
				{
					text: 'Download',
					url: 'https://developer.hashicorp.com/vault/downloads',
				},
				{
					text: 'Try HCP Vault',
					url: 'https://portal.cloud.hashicorp.com/sign-up',
					theme: {
						brand: 'vault',
					},
				},
			]}
			currentPath={asPath}
			menuItems={menuItems}
			menuItemsAlign="right"
			constrainWidth
			matchOnBasePath
			Link={Link}
		/>
	)
}
