// Third-party imports
import { useRouter } from 'next/router'

// HashiCorp imports
import { IconMenu24 } from '@hashicorp/flight-icons/svg-react/menu-24'
import { IconSignIn16 } from '@hashicorp/flight-icons/svg-react/sign-in-16'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { IconUserPlus16 } from '@hashicorp/flight-icons/svg-react/user-plus-16'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'

// Global imports
import { getUserMenuItems } from 'lib/auth/user'
import useAuthentication from 'hooks/use-authentication'
import { useCurrentProduct, useMobileMenu } from 'contexts'
import Button from 'components/button'
import { CommandBarActivator } from 'components/command-bar'
import StandaloneLink from 'components/standalone-link'
import UserDropdownDisclosure from 'components/user-dropdown-disclosure'

// Local imports
import { NavigationHeaderItem } from './types'
import {
	GiveFeedbackButton,
	HomePageHeaderContent,
	ProductPageHeaderContent,
} from './components'
import s from './navigation-header.module.css'

const GLOBAL_SEARCH_ENABLED = __config.flags.enable_global_search

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
	const { showAuthenticatedUI, showUnauthenticatedUI, signIn, signOut, user } =
		useAuthentication()

	if (!showAuthenticatedUI && !showUnauthenticatedUI) {
		return null
	}

	let content
	if (showUnauthenticatedUI) {
		content = (
			<>
				<Button
					icon={<IconSignIn16 />}
					iconPosition="trailing"
					onClick={() => signIn()}
					text="Sign In"
				/>
				<StandaloneLink
					className={s.signUpLink}
					textClassName={s.signUpLinkText}
					href="/sign-up"
					icon={<IconUserPlus16 />}
					iconPosition="trailing"
					text="Sign Up"
				/>
			</>
		)
	} else if (showAuthenticatedUI) {
		content = (
			<UserDropdownDisclosure
				className={s.userDropdownDisclosure}
				listPosition="right"
				items={getUserMenuItems({ signOut })}
				user={user}
			/>
		)
	}

	return <div className={s.authenticationControls}>{content}</div>
}

/**
 * The main navigation header for all DevDot pages. Renders two different
 * styles: one for the main home page, and one for all routes under
 * `/{productSlug}.`
 */
const NavigationHeader = () => {
	const router = useRouter()
	const currentProduct = useCurrentProduct()

	const shouldRenderGenericHeaderContent =
		!currentProduct || router.route === '/_error'
	const LeftSideHeaderContent = shouldRenderGenericHeaderContent
		? HomePageHeaderContent
		: ProductPageHeaderContent

	return (
		<header className={s.root}>
			<LeftSideHeaderContent />
			<div className={s.rightSide}>
				<GiveFeedbackButton className="g-hide-with-mobile-menu" />
				{GLOBAL_SEARCH_ENABLED ? (
					<CommandBarActivator
						leadingIcon={<IconSearch16 />}
						visualLabel="Search"
					/>
				) : null}
				<AuthenticationControls />
				<MobileMenuButton />
			</div>
		</header>
	)
}

export type { NavigationHeaderItem }
export default NavigationHeader
