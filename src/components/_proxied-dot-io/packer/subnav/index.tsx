/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import s from './style.module.css'

export default function PackerSubnav({ menuItems }) {
	const router = useRouter()
	const [currentPath, setCurrentPath] = useState('')

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	return (
		<Subnav
			className={s.subnav}
			titleLink={{
				text: 'Packer',
				url: '/',
			}}
			ctaLinks={[
				{
					text: 'GitHub',
					url: `https://www.github.com/hashicorp/packer`,
				},
				{
					text: 'Install Packer',
					url: 'https://developer.hashicorp.com/packer/downloads',
				},
				{
					text: 'Try HCP Packer',
					url: 'https://portal.cloud.hashicorp.com/sign-up',
					theme: {
						brand: 'packer',
					},
				},
			]}
			hideGithubStars={true}
			currentPath={currentPath}
			menuItemsAlign="right"
			menuItems={menuItems}
			constrainWidth
			matchOnBasePath
		/>
	)
}
