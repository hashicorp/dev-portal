import VaultIoLayout from 'layouts/_proxied-dot-io/vault'
import Link from 'next/link'
import Button from '@hashicorp/react-button'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import s from './style.module.css'

function DownloadsPage({ product, releases, latestVersion }) {
	const changelogUrl = `https://github.com/hashicorp/vault/blob/main/CHANGELOG.md`

	return (
		<ProductDownloadsPage
			product={product}
			releases={releases}
			latestVersion={latestVersion}
			changelog={changelogUrl}
			getStartedDescription="Follow step-by-step tutorials on the essentials of Vault."
			getStartedLinks={[
				{
					label: 'Getting Started with the CLI',
					href: 'http://learn.hashicorp.com/collections/vault/getting-started',
				},
				{
					label: 'Getting Started with Vault UI',
					href: 'http://learn.hashicorp.com/collections/vault/getting-started-ui',
				},
				{
					label: 'Vault on HCP',
					href: 'http://learn.hashicorp.com/collections/vault/getting-started-ui',
				},
				{
					label: 'View all Vault tutorials',
					href: 'https://learn.hashicorp.com/vault',
				},
			]}
			logo={
				<img
					className={s.logo}
					alt="Vault"
					src={require('./img/vault-logo.svg')}
				/>
			}
			tutorialLink={{
				href: 'https://learn.hashicorp.com/vault',
				label: 'View Tutorials at HashiCorp Learn',
			}}
			merchandisingSlot={
				<>
					<MerchandisingSlot />
					<p className={s.releaseNote}>
						Release notes are available in our{' '}
						<Link href={`/docs/release-notes`}>
							<a>documentation</a>
						</Link>
						.
					</p>
				</>
			}
		/>
	)
}

export const getStaticProps = () => generateStaticProps('vault')

function MerchandisingSlot() {
	return (
		<div className={s.merchandisingSlot}>
			<div className={s.centerWrapper}>
				<p>
					Want all of the power and security of Vault, without the complexity
					and overhead of managing it yourself?
				</p>
				<Button
					title="Sign up for HCP Vault"
					linkType="inbound"
					url="https://portal.cloud.hashicorp.com/sign-up"
					theme={{
						variant: 'tertiary',
						brand: 'vault',
					}}
				/>
			</div>
		</div>
	)
}

DownloadsPage.layout = VaultIoLayout
export default DownloadsPage
