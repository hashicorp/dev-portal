// Library
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
// Layout
import BaseNewLayout from 'layouts/base-new'
// Components
import MobileMenuContainer, {
	MobileAuthenticationControls,
} from 'components/mobile-menu-container'
import { SidebarNavMenuItem } from 'components/sidebar/components'
// Types
import type { BaseNewLayoutProps } from 'layouts/base-new/types'
// Styles
import s from './base-layout-with-mobile-menu.module.css'

/**
 * A mobile menu pane with contents for use on on non-product pages.
 *
 * Note the `MobileMenuContainer` component is only the "pane" part of the
 * mobile menu. The "hamburger icon" `MobileMenuButton` is expected to be
 * rendered by our `NavigationBar` component.
 *
 * The `MobileMenuContainer` hooks into our mobile menu context
 * from `src/contexts/mobile-menu.tsx` to determine open-and-closed state, and
 * in turn determines visibility of the root `motion.div` of that component.
 */
function NonProductPageMobileMenu() {
	return (
		<MobileMenuContainer className={s.mobileMenuContainer}>
			<MobileAuthenticationControls />
			<ul className={s.mobileMenuNavList}>
				<SidebarNavMenuItem item={{ heading: 'Main Menu' }} />
				{generateTopLevelSubNavItems().map((item: $TSFixMe, index: number) => (
					// eslint-disable-next-line react/no-array-index-key
					<SidebarNavMenuItem item={item} key={index} />
				))}
			</ul>
		</MobileMenuContainer>
	)
}

/**
 * Render our base layout with generic mobile menu contents.
 */
function BaseLayoutWithMobileMenu(
	props: Omit<BaseNewLayoutProps, 'mobileMenuSlot'>
) {
	return (
		<BaseNewLayout {...props} mobileMenuSlot={<NonProductPageMobileMenu />} />
	)
}

export default BaseLayoutWithMobileMenu
