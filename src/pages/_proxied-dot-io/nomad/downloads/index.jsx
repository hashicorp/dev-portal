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
        <div className={s.releaseCandidate}>
          <p>
            A release candidate for Nomad v1.5.0 is available! The release can be{' '}
            <a href="https://releases.hashicorp.com/nomad/1.5.0-rc.1/">
            downloaded here.
            </a>
          </p>
        </div>
        </>
      }
		/>
	)
}

export const getStaticProps = () => generateStaticProps('nomad')

DownloadsPage.layout = NomadIoLayout
export default DownloadsPage
