/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Subnav from '@hashicorp/react-subnav'
import classNames from 'classnames'
import { useFlagBag } from 'flags/client'
import useProxiedPath from 'lib/hooks/useProxiedPath'
import s from './style.module.css'

export default function ConsulSubnav({ menuItems }) {
	const { asPath } = useProxiedPath()
	const flagBag = useFlagBag()
	const classnames = classNames(
		s.subnav,
		flagBag.settled && s.settled,
		flagBag.flags?.tryForFree ? s.control : s.variant
	)
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
					text:
						flagBag.settled && flagBag.flags.tryForFree
							? 'Try for Free'
							: 'Try HCP Consul',
					url: 'https://portal.cloud.hashicorp.com/sign-up',
					theme: {
						brand: 'consul',
					},
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
