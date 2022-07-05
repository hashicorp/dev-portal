import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import packerData from 'data/packer.json'
import installData from 'data/packer-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import ProductDownloadsView from 'views/product-downloads-view'

const PackerDownloadsPage = (props: GeneratedProps): ReactElement => {
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
	const product = packerData as ProductData

	return generateStaticProps(product)
}

export default PackerDownloadsPage
