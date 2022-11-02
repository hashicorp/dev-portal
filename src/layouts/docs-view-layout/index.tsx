import SidebarSidecarLayout, {
	SidebarSidecarLayoutProps,
} from 'layouts/sidebar-sidecar'

/**
 * Lightweight wrapper around SidebarSidecarLayout which passes along some docs specific props.
 *
 * Currently, this determines whether or not to render the beta opt-out button.
 */
const DocsViewLayout = (props: SidebarSidecarLayoutProps) => {
	return <SidebarSidecarLayout {...props} />
}

export default DocsViewLayout
