/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as React from 'react'
import Subnav from '@hashicorp/react-subnav'
import { isInUS } from '@hashicorp/platform-util/geo'
import classNames from 'classnames'
import { useFlagBag } from 'flags/client'
import { abTestTrack } from 'lib/ab-test-track'
import useProxiedPath from 'lib/hooks/useProxiedPath'
import s from './style.module.css'

export default function ConsulSubnav({ menuItems }) {
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
				text: 'HashiCorp Consul',
				url: '/',
			}}
			ctaLinks={[
				{
					text: 'GitHub',
					url: 'https://www.github.com/hashicorp/consul',
				},

				{
					text: 'Download',
					url: 'https://developer.hashicorp.com/consul/downloads',
				},
				{
					text: renderVariant ? 'Try for free' : 'Try HCP Consul',
					url: 'https://portal.cloud.hashicorp.com/sign-up',
					theme: {
						brand: 'consul',
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
			menuItemsAlign="right"
			menuItems={menuItems}
			constrainWidth
			matchOnBasePath
		/>
	)
}
