import EnterpriseAlertBase from '@hashicorp/react-enterprise-alert'
import { useCurrentProduct } from 'contexts'

function MdxEnterpriseAlert(props) {
	const currentProduct = useCurrentProduct()
	return <EnterpriseAlertBase product={currentProduct?.slug} {...props} />
}

export { MdxEnterpriseAlert }
