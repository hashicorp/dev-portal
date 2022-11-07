import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import s from './subnav.module.css'

export default function NomadSubnav({ menuItems }) {
	const router = useRouter()
	const [currentPath, setCurrentPath] = useState()

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	return (
		<Subnav
			className={s.subnav}
			titleLink={{
				text: 'HashiCorp Nomad',
				url: '/',
			}}
			ctaLinks={[
				{ text: 'GitHub', url: 'https://www.github.com/hashicorp/nomad' },
				{
					text: 'Download',
					url: 'https://developer.hashicorp.com/nomad/downloads',
					theme: { brand: 'nomad' },
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
