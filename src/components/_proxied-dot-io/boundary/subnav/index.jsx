import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import s from './subnav.module.css'

export default function BoundarySubnav({ menuItems }) {
	const router = useRouter()
	const [currentPath, setCurrentPath] = useState()

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	return (
		<Subnav
			className={s.subnav}
			titleLink={{
				text: 'HashiCorp Boundary',
				url: '/',
			}}
			ctaLinks={[
				{
					text: 'GitHub',
					url: `https://www.github.com/hashicorp/boundary`,
				},
				{
					text: 'Download',
					url: '/downloads',
				},
				{
					text: 'Try HCP Boundary',
					url: 'https://portal.cloud.hashicorp.com/sign-up',
					theme: {
						brand: 'boundary',
					},
				},
			]}
			currentPath={currentPath}
			menuItemsAlign="right"
			menuItems={menuItems}
			constrainWidth
			matchOnBasePath
		/>
	)
}
