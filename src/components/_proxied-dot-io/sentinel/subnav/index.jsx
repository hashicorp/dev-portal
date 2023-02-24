/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import productData from 'data/sentinel'
import { useRouter } from 'next/router'

export default function SentinelSubnav() {
	const router = useRouter()
	const [currentPath, setCurrentPath] = useState()

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	return (
		<Subnav
			titleLink={{
				text: 'Sentinel',
				url: '/',
			}}
			ctaLinks={[{ text: 'Download', url: '/sentinel/downloads' }]}
			currentPath={currentPath}
			menuItemsAlign="right"
			menuItems={productData.subnavItems}
			constrainWidth
		/>
	)
}
