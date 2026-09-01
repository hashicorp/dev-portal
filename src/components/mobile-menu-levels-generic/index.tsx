/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import MobileMenuContainer, {
	MobileAuthenticationControls,
	MobileOptionMenuContainer,
} from 'components/mobile-menu-container'
import ProductPanel from '@hashicorp/react-components/src/components/nav-panel/product-panel'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { IconChevronRight24 } from '@hashicorp/flight-icons/svg-react/chevron-right-24'
import Text from '@components/text'
// Data
import { mobileNavigationData, navPromo, sidePanelContent } from 'lib/products'
import { useMobileMenu } from 'contexts'
// Styles
import s from './mobile-menu-levels-generic.module.css'

// Types
import { ProductCategoriesProps } from '@hashicorp/react-components/src/components/nav-panel/product-panel'
import { PromoProps } from '@hashicorp/react-components/src/components/nav-panel/components/promo'
import { ProductSidePanel } from 'types/products'

interface MobileMenuOptionProps {
	label: string
	productCategories?: ProductCategoriesProps
	navPromo?: PromoProps
	sidePanelContent?: ProductSidePanel
	isPromoOnTop?: boolean
}

function MobileMenuOption({
	label,
	productCategories,
	navPromo,
	sidePanelContent,
	isPromoOnTop,
}: MobileMenuOptionProps) {
	const { currentMobileSubOption, setCurrentMobileSubOption } = useMobileMenu()

	return (
		<>
			<button
				className={s.mobileMenuButton}
				onClick={() => setCurrentMobileSubOption(label)}
			>
				<Text size={300} weight={'semibold'}>
					{label}
				</Text>
				<IconChevronRight24 />
			</button>
			<MobileOptionMenuContainer label={label}>
				<div className={currentMobileSubOption === label ? s.visible : s.hidden}>
					<ProductPanel
						productCategories={productCategories}
						promo={navPromo && navPromo}
						sidePanel={sidePanelContent && sidePanelContent}
						isPromoOnTop={isPromoOnTop && isPromoOnTop}
						isDevPortal={true}
					/>
				</div>
			</MobileOptionMenuContainer>
		</>
	)
}

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
	sidePanelContent.label = '' // Remove "Learn" from rendering
	return (
		<MobileMenuContainer className={s.mobileMenuContainer}>
			<MobileAuthenticationControls className={s.mobileMenuAuthContainer} />

			<NavigationMenu.Root className={s.mobileMenuNavList}>
				<MobileMenuOption
					label={'Product'}
					productCategories={mobileNavigationData}
					navPromo={navPromo}
				/>
				<MobileMenuOption
					label={'Learn'}
					productCategories={[]}
					sidePanelContent={sidePanelContent}
				/>
			</NavigationMenu.Root>
		</MobileMenuContainer>
	)
}

export default MobileMenuLevelsGeneric
