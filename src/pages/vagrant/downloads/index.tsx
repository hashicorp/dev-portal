import GetStartedCard from 'components/get-started-card'
import vagrantData from 'data/vagrant.json'
import { ProductData } from 'types/products'
import ProductDownloadsView from 'views/product-downloads-view'
import { generateGetStaticProps } from 'views/product-downloads-view/server'

function VagrantDownloadsMerchandisingSlot() {
	return (
		<GetStartedCard
			heading="VMware Utility"
			headingSlug="vmware-utility"
			body="From this page you can download the VMware utility, review lease information and much more. These tools are maintained by HashiCorp and the Vagrant Community."
			ctas={[{ text: 'Download', url: '/vagrant/downloads/vmware' }]}
		/>
	)
}

function VagrantDownloadsPage(props) {
	return (
		<ProductDownloadsView
			{...props}
			merchandisingSlot={<VagrantDownloadsMerchandisingSlot />}
		/>
	)
}

const getStaticProps = generateGetStaticProps(vagrantData as ProductData)

export { getStaticProps }
export default VagrantDownloadsPage
