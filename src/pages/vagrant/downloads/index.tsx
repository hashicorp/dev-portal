import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import vagrantData from 'data/vagrant.json'
import installData from 'data/vagrant-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import ProductDownloadsView from 'views/product-downloads-view'

const VagrantDownloadsPage = (props: GeneratedProps): ReactElement => {
	const { latestVersion, releases } = props
	return (
		<ProductDownloadsView
			latestVersion={latestVersion}
			pageContent={installData}
			releases={releases}
		/>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const product = vagrantData as ProductData

	return generateStaticProps(product)
}

export default VagrantDownloadsPage
