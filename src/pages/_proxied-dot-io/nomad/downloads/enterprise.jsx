/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import NomadIoLayout from 'layouts/_proxied-dot-io/nomad'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import s from './style.module.css'

function DownloadsPage({ product, releases, latestVersion }) {
	return (
		<ProductDownloadsPage
			product={product}
			releases={releases}
			latestVersion={latestVersion}
			enterpriseMode
			getStartedDescription="Follow step-by-step tutorials on the essentials of Nomad."
			getStartedLinks={[
				{
					label: 'Getting Started',
					href: 'https://developer.hashicorp.com/nomad/tutorials/get-started',
				},
				{
					label: 'Deploy and Manage Nomad Jobs',
					href: 'https://developer.hashicorp.com/nomad/tutorials/manage-jobs',
				},
				{
					label: 'Explore the Nomad Web UI',
					href: 'https://developer.hashicorp.com/nomad/tutorials/web-ui',
				},
				{
					label: 'View all Nomad tutorials',
					href: 'https://developer.hashicorp.com/nomad/tutorials',
				},
			]}
			logo={
				<img
					className={s.logo}
					alt="Nomad"
					src={require('@hashicorp/mktg-logos/product/nomad/primary/color.svg')}
				/>
			}
			tutorialLink={{
				href: 'https://developer.hashicorp.com/nomad/tutorials',
				label: 'View Tutorials',
			}}
			merchandisingSlot={
				<p className={s.legalNotice}>
					<em>
						The following shall apply unless your organization has a separately
						signed Enterprise License Agreement or Evaluation Agreement
						governing your use of the package: Enterprise packages in this
						repository are subject to the license terms located in the package.
						Please read the license terms prior to using the package. Your
						installation and use of the package constitutes your acceptance of
						these terms. If you do not accept the terms, do not use the package.
					</em>
				</p>
			}
			packageManagerOverrides={[
				{
					label: 'Homebrew',
					commands: [
						`brew tap hashicorp/tap`,
						`brew install hashicorp/tap/${product}-enterprise`,
					],
					os: 'darwin',
				},
				{
					label: 'Homebrew',
					commands: [
						`brew tap hashicorp/tap`,
						`brew install hashicorp/tap/${product}-enterprise`,
					],
					os: 'linux',
				},
			]}
		/>
	)
}

export const getStaticProps = () => generateStaticProps('nomad')

DownloadsPage.layout = NomadIoLayout
export default DownloadsPage
