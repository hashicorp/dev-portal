import Link from 'next/link'
import VagrantIoLayout from 'layouts/_proxied-dot-io/vagrant'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import s from './style.module.css'

function DownloadsPage({ product, releases, latestVersion }) {
	return (
		<ProductDownloadsPage
			product={product}
			releases={releases}
			latestVersion={latestVersion}
			getStartedDescription="Follow step-by-step tutorials on the essentials of Vagrant."
			getStartedLinks={[
				{
					label: 'Quick Start',
					href: 'https://developer.hashicorp.com/vagrant/tutorials/getting-started/getting-started-index',
				},
				{
					label: 'Install and Specify a Box',
					href: 'https://developer.hashicorp.com/vagrant/tutorials/getting-started/getting-started-boxes',
				},
				{
					label: 'Configure the Network',
					href: 'https://developer.hashicorp.com/vagrant/tutorials/networking-provisioning-operations/getting-started-networking',
				},
				{
					label: 'View all Vagrant tutorials',
					href: 'https://developer.hashicorp.com/vagrant/tutorials',
				},
			]}
			logo={
				<img
					className={s.logo}
					alt="Vagrant"
					src={require('@hashicorp/mktg-logos/product/vagrant/primary/color.svg')}
				/>
			}
			tutorialLink={{
				href: 'https://developer.hashicorp.com/vagrant/tutorials',
				label: 'View Tutorials',
			}}
			merchandisingSlot={
				<Link href="/vmware/downloads">&raquo; Download VMware Utility</Link>
			}
			packageManagerOverrides={[
				{
					label: 'Homebrew',
					commands: [`brew install hashicorp/tap/hashicorp-vagrant`],
					os: 'darwin',
				},
			]}
		/>
	)
}

export const getStaticProps = () => generateStaticProps('vagrant')

DownloadsPage.layout = VagrantIoLayout
export default DownloadsPage
