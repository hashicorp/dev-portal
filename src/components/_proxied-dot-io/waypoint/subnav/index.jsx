import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import Link from 'next/link'
import productData from 'data/waypoint'

export default function ProductSubnav() {
	const router = useRouter()
	const [currentPath, setCurrentPath] = useState()

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	return (
		<Subnav
			titleLink={{
				text: 'Waypoint',
				url: '/',
			}}
			ctaLinks={[
				{
					text: 'GitHub',
					url: `https://www.github.com/hashicorp/${productData.slug}`,
				},
				{
					text: 'Download',
					url: 'https://developer.hashicorp.com/waypoint/downloads',
				},
			]}
			hideGithubStars={true}
			currentPath={currentPath}
			menuItemsAlign="center"
			menuItems={productData.subnavItems}
			constrainWidth
			Link={Link}
			matchOnBasePath
		/>
	)
}
