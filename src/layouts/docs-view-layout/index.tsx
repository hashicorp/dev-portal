import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'
import { DocsVersionAlertBanner } from './components'

/**
 * Lightweight wrapper around SidebarSidecarLayout which passes along some docs
 * specific props.
 */
const DocsViewLayout = (props: SidebarSidecarLayoutProps) => {
	return (
		<SidebarSidecarLayout
			{...props}
			alertBannerSlot={<DocsVersionAlertBanner />}
		/>
	)
}

export default DocsViewLayout
