/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { useRouter } from 'next/router'

// HashiCorp imports
import { IconMenu24 } from '@hashicorp/flight-icons/svg-react/menu-24'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'

// Global imports
import { getUserMenuItems } from 'lib/auth/user'
import useAuthentication from 'hooks/use-authentication'
import { useCurrentProduct, useMobileMenu } from 'contexts'
import { CommandBarActivator } from 'components/command-bar'
import UserDropdownDisclosure from 'components/user-dropdown-disclosure'

// Local imports
import { NavigationHeaderItem } from './types'
import { HomePageHeaderContent, ProductPageHeaderContent } from './components'
import s from './navigation-header.module.css'

/**
 * The header content displayed to the far right of the window. This content is
 * the same for every page in the app.
 */
const MobileMenuButton = () => {
	const { mobileMenuIsOpen, setMobileMenuIsOpen } = useMobileMenu()
	const ariaLabel = `${mobileMenuIsOpen ? 'Close' : 'Open'} navigation menu`

	return (
		<>
			<button
				aria-label={ariaLabel}
				className={s.mobileMenuButton}
				onClick={() => setMobileMenuIsOpen((prevState) => !prevState)}
			>
				{mobileMenuIsOpen ? <IconX24 /> : <IconMenu24 />}
			</button>
		</>
	)
}

/**
 * Handles rendering the Sign In and Sign Up UI elements. Automatically hides
 * the elements with CSS on tablet and smaller viewports.
 */
const AuthenticationControls = () => {
	const { signIn, signOut, user } = useAuthentication()

	return (
		<div className={s.authenticationControls}>
			<UserDropdownDisclosure
				activatorClassName={s.userDropdownDisclosureActivator}
				listPosition="right"
				items={
					user
						? getUserMenuItems({ signOut })
						: [
								{
									label: 'Sign in',
									onClick: () => signIn(),
								},
								{
									href: '/sign-up',
									label: 'Sign up',
								},
						  ]
				}
				user={user}
			/>
		</div>
	)
}

/**
 * The main navigation header for all DevDot pages. Renders two different
 * styles: one for the main home page, and one for all routes under
 * `/{productSlug}.`
 */
const NavigationHeader = () => {
	const router = useRouter()
	const currentProduct = useCurrentProduct()
	const { session } = useAuthentication()

	const commandBarActivatorLabel = session?.meta?.isAIEnabled
		? 'Find or ask anything...'
		: 'Search'

	const shouldRenderGenericHeaderContent =
		!currentProduct || router.route === '/_error'
	const LeftSideHeaderContent = shouldRenderGenericHeaderContent
		? HomePageHeaderContent
		: ProductPageHeaderContent

	return (
		<header className={s.root}>
			<div className={s.leftSide}>
				<LeftSideHeaderContent />
			</div>
			<div className={s.rightSide}>
				<CommandBarActivator
					leadingIcon={<IconSearch16 />}
					visualLabel={commandBarActivatorLabel}
				/>
				<AuthenticationControls />
				<MobileMenuButton />
			</div>
		</header>
	)
}

export type { NavigationHeaderItem }
export default NavigationHeader
