/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as React from 'react'
import Subnav from '@hashicorp/react-subnav'
import { isInUS } from '@hashicorp/platform-util/geo'
import classNames from 'classnames'
import useProxiedPath from 'lib/hooks/useProxiedPath'
import { abTestTrack } from 'lib/ab-test-track'
import { useFlagBag } from 'flags/client'
import Link from 'next/link'
import s from './style.module.css'

export default function ProductSubnav({ menuItems }) {
	const { asPath } = useProxiedPath()
	const flagBag = useFlagBag()
	const renderVariant = React.useMemo(() => {
		return isInUS() && flagBag.settled && flagBag.flags?.tryForFree
	}, [flagBag])
	const classnames = classNames(s.subnav, flagBag.settled && s.settled)

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
					onClick: () =>
						abTestTrack({
							type: 'Result',
							test_name: 'io-site primary CTA copy test 03-23',
							variant: renderVariant ? 'true' : 'false',
						}),
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
