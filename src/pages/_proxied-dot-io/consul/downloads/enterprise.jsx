import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import baseProps from 'components/_proxied-dot-io/consul/downloads-props'
import s from './style.module.css'

function DownloadsPage({ product, releases, latestVersion }) {
	return (
		<ProductDownloadsPage
			enterpriseMode={true}
			{...baseProps(
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
			)}
			product={product}
			releases={releases}
			latestVersion={latestVersion}
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

export const getStaticProps = () => generateStaticProps('consul')

DownloadsPage.layout = ConsulIoLayout
export default DownloadsPage
