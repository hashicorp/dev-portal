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
					href: 'https://developer.hashicorp.com/vault/tutorials/getting-started',
				},
				{
					label: 'Getting Started with Vault UI',
					href: 'https://developer.hashicorp.com/vault/tutorials/getting-started-ui',
				},
				{
					label: 'Vault on HCP',
					href: 'https://developer.hashicorp.com/vault/tutorials/cloud',
				},
				{
					label: 'View all Vault tutorials',
					href: 'https://developer.hashicorp.com/vault/tutorials',
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
				href: 'https://developer.hashicorp.com/vault/tutorials',
				label: 'View Tutorials',
			}}
			merchandisingSlot={
				<>
					<MerchandisingSlot />
					<p className={s.releaseNote}>
						Release notes are available in our{' '}
						<Link href={`/docs/release-notes`}>documentation</Link>.
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
