import Subnav from '@hashicorp/react-subnav'
import classNames from 'classnames'
import useProxiedPath from 'lib/hooks/useProxiedPath'
import s from './style.module.css'
import Link from 'next/link'

export default function ProductSubnav({ menuItems }) {
	const { asPath } = useProxiedPath()

	return (
		<Subnav
			className={classNames('g-product-subnav', s.subnav)}
			hideGithubStars={true}
			titleLink={{
				text: 'HashiCorp Vault',
				url: '/',
			}}
			ctaLinks={[
				{
					text: 'GitHub',
					url: 'https://www.github.com/hashicorp/vault',
				},
				{
					text: 'Download',
					url: 'https://developer.hashicorp.com/vault/downloads',
				},
				{
					text: 'Try HCP Vault',
					url: 'https://portal.cloud.hashicorp.com/sign-up',
					theme: {
						brand: 'vault',
					},
				},
			]}
			currentPath={asPath}
			menuItems={menuItems}
			menuItemsAlign="right"
			constrainWidth
			matchOnBasePath
			Link={Link}
		/>
	)
}
