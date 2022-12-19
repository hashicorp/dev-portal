import Subnav from '@hashicorp/react-subnav'
import useProxiedPath from 'lib/hooks/useProxiedPath'
import s from './style.module.css'

export default function ConsulSubnav({ menuItems }) {
	const { asPath } = useProxiedPath()
	return (
		<Subnav
			className={s.subnav}
			hideGithubStars={true}
			titleLink={{
				text: 'HashiCorp Consul',
				url: '/',
			}}
			ctaLinks={[
				{
					text: 'GitHub',
					url: 'https://www.github.com/hashicorp/consul',
				},

				{
					text: 'Download',
					url: 'https://developer.hashicorp.com/consul/downloads',
				},
				{
					text: 'Try HCP Consul',
					url: 'https://portal.cloud.hashicorp.com/sign-up',
					theme: {
						brand: 'consul',
					},
				},
			]}
			currentPath={asPath}
			menuItemsAlign="right"
			menuItems={menuItems}
			constrainWidth
			matchOnBasePath
		/>
	)
}
