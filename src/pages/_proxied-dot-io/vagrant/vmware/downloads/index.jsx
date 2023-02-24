/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
			pageTitle="Download Vagrant vmware Utility"
			getStartedDescription="Follow step-by-step tutorials on the essentials of Vagrant VMWare Utility."
			getStartedLinks={[
				{
					label: 'Installation Instructions',
					href: 'https://www.vagrantup.com/docs/providers/vmware/installation',
				},
				{
					label: 'Community Resources',
					href: 'https://www.vagrantup.com/community',
				},
				{
					label: 'View all Vagrant tutorials',
					href: 'https://developer.hashicorp.com/vagrant/tutorials',
				},
			]}
			logo={<p className={s.notALogo}>Vagrant vmware Utility</p>}
			tutorialLink={{
				href: 'https://developer.hashicorp.com/vagrant/tutorials',
				label: 'View Tutorials at HashiCorp Learn',
			}}
			showPackageManagers={false}
		/>
	)
}

export const getStaticProps = () =>
	generateStaticProps('vagrant-vmware-utility')

DownloadsPage.layout = VagrantIoLayout
export default DownloadsPage
