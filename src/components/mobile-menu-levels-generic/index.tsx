/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import MobileMenuContainer, {
	MobileAuthenticationControls,
} from 'components/mobile-menu-container'
import ProductPanel from '@hashicorp/react-components/src/components/nav-panel/product-panel'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
// Hooks
// Experiment: product-dropdown-promo-placement START
import { useFeatureFlagVariantKey } from 'posthog-js/react'
// Experiment: product-dropdown-promo-placement END
// Data
import { mobileNavigationData, navPromo, sidePanelContent } from 'lib/products'
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
	// Experiment: product-dropdown-promo-placement START
	const featureFlagKey = useFeatureFlagVariantKey(
		'product-dropdown-promo-placement'
	)
	// Experiment: product-dropdown-promo-placement END
	return (
		<MobileMenuContainer className={s.mobileMenuContainer}>
			<MobileAuthenticationControls className={s.mobileMenuAuthContainer} />

			<NavigationMenu.Root className={s.mobileMenuNavList}>
				<ProductPanel
					productCategories={mobileNavigationData}
					promo={navPromo}
					sidePanel={sidePanelContent}
					isPromoOnTop={featureFlagKey === 'variant'}
				/>
			</NavigationMenu.Root>
		</MobileMenuContainer>
	)
}

export default MobileMenuLevelsGeneric
