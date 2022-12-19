import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'

const getStaticProps = generateGetStaticProps(vagrantData as ProductData, {
	installName: 'Vagrant VMware Utility',
	releaseSlug: 'vagrant-vmware-utility',
	jsonFilePath: `src/content/${vagrantData.slug}/install-vmware-landing.json`,
})

export { getStaticProps }
export default ProductDownloadsView
