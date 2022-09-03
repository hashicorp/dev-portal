import { useEffect, useState } from 'react'
import Subnav from '@hashicorp/react-subnav'
import productData from 'data/packer'
import { useRouter } from 'next/router'

export default function PackerSubnav() {
	const router = useRouter()
	const [currentPath, setCurrentPath] = useState()

	useEffect(() => {
		setCurrentPath(router.asPath)
	}, [router.asPath])

	return (
		<Subnav
			titleLink={{
				text: 'packer',
				url: '/',
			}}
			ctaLinks={[
				{ text: 'GitHub', url: 'https://www.github.com/hashicorp/packer' },
				{ text: 'Download', url: '/downloads' },
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
			menuItems={productData.subnavItems}
			constrainWidth
			matchOnBasePath
		/>
	)
}
