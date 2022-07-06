import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function ProductSubnav({ menuItems }) {
	const router = useRouter()
	const [currentPath, setCurrentPath] = useState('')

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
					url: `https://www.github.com/hashicorp/waypoint`,
				},
				{
					text: 'Download',
					url: '/downloads',
				},
			]}
			hideGithubStars={true}
			currentPath={currentPath}
			menuItemsAlign="center"
			menuItems={menuItems}
			constrainWidth
			Link={Link}
			matchOnBasePath
		/>
	)
}
