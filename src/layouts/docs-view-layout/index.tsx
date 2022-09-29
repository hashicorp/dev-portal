import { useCurrentProduct } from 'contexts/current-product'
import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import OptInOut from 'components/opt-in-out'

/**
 * Lightweight wrapper around SidebarSidecarLayout which passes along some docs specific props.
 *
 * Currently, this determines whether or not to render the beta opt-out button.
 */
const DocsViewLayout = (props: SidebarSidecarLayoutProps) => {
	const currentProduct = useCurrentProduct()

	const optInOutSlot = <OptInOut platform={`${currentProduct.slug}-io`} />

	return <SidebarSidecarLayout {...props} optInOutSlot={optInOutSlot} />
}

export default DocsViewLayout
