// Library
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
// Components
import MobileMenuContainer, {
	MobileAuthenticationControls,
} from 'components/mobile-menu-container'
import { SidebarNavMenuItem } from 'components/sidebar/components'
// Styles
import s from './mobile-menu-levels-generic.module.css'

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
function MobileMenuLevelsGeneric() {
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

export default MobileMenuLevelsGeneric
