import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import { useRouter } from 'next/router'
import s from './style.module.css'

export default function VagrantSubnav({ menuItems }) {
	const router = useRouter()
	const [, setCurrentPath] = useState('')

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	return (
		<Subnav
			className={s.subnav}
			titleLink={{
				text: 'vagrant',
				url: '/',
			}}
			ctaLinks={[
				{ text: 'GitHub', url: 'https://www.github.com/hashicorp/vagrant' },
				{ text: 'Download', url: '/downloads' },
			]}
			currentPath={router.pathname}
			menuItemsAlign="right"
			menuItems={menuItems}
			constrainWidth
			matchOnBasePath
		/>
	)
}
