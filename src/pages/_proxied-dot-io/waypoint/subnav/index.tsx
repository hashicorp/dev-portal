import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import s from './style.module.css'

export default function WaypointSubnav({ menuItems }) {
	const router = useRouter()
	const [currentPath, setCurrentPath] = useState('')

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	return (
		<Subnav
			className={s.subnav}
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
					text: 'Install Waypoint',
					url: '/downloads',
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
