import { useCurrentProduct } from 'contexts/current-product'
import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import OptInOut from 'components/opt-in-out'
import getIsBetaProduct from 'lib/get-is-beta-product'

/**
 * Lightweight wrapper around SidebarSidecarLayout which passes along some docs specific props.
 *
 * Currently, this determines whether or not to render the beta opt-out button.
 */
const DocsViewLayout = (props: SidebarSidecarLayoutProps) => {
	const currentProduct = useCurrentProduct()
	// Products will be removed from the beta array as we shift them to GA, which will hide the opt out button
	const isBetaProduct = getIsBetaProduct(currentProduct.slug)

	const optInOutSlot = isBetaProduct ? (
		<OptInOut platform={`${currentProduct.slug}-io`} />
	) : null
	return <SidebarSidecarLayout {...props} optInOutSlot={optInOutSlot} />
}

export default DocsViewLayout
