import consulData from 'data/consul.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
import { ConsulDownloadsMerchandisingSlot } from '.'

const ConsulEnterpriseDownloadsPage = (props) => {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={<ConsulDownloadsMerchandisingSlot />}
		/>
	)
}

const getStaticProps = generateGetStaticProps(consulData as ProductData, {
	isEnterpriseMode: true,
})

export { getStaticProps }
export default ConsulEnterpriseDownloadsPage
