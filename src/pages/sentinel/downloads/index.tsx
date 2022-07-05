import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import sentinelData from 'data/sentinel.json'
import installData from 'data/sentinel-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import ProductDownloadsView from 'views/product-downloads-view'

const SentinelDownloadsPage = (props: GeneratedProps): ReactElement => {
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
	const product = sentinelData as ProductData

	return generateStaticProps(product)
}

export default SentinelDownloadsPage
