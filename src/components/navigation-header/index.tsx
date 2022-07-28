import { useRouter } from 'next/router'
import { IconMenu24 } from '@hashicorp/flight-icons/svg-react/menu-24'
import { IconUserPlus16 } from '@hashicorp/flight-icons/svg-react/user-plus-16'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'
import { useCurrentProduct, useMobileMenu } from 'contexts'
import useAuthentication from 'hooks/use-authentication'
import Button from 'components/button'
import StandaloneLink from 'components/standalone-link'
import { NavigationHeaderItem } from './types'
import {
	GiveFeedbackButton,
	HomePageHeaderContent,
	ProductPageHeaderContent,
} from './components'
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
 *
 * @TODO Render user dropdown disclosure for authenticated users
 * ref: https://app.asana.com/0/1202097197789424/1202665629707458/f
 */
const AuthenticationControls = () => {
	const { isAuthEnabled, isAuthenticated, isLoading, signIn } =
		useAuthentication()
	const shouldShowAuthButtons = isAuthEnabled && !isLoading && !isAuthenticated

	if (!shouldShowAuthButtons) {
		return null
	}

	return (
		<div className={s.authenticationControls}>
			<Button onClick={() => signIn()} text="Sign In" />
			<StandaloneLink
				className={s.signUpLink}
				textClassName={s.signUpLinkText}
				href="/sign-up"
				icon={<IconUserPlus16 />}
				iconPosition="trailing"
				text="Sign Up"
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

	const shouldRenderGenericHeaderContent =
		!currentProduct || router.route === '/_error'
	const LeftSideHeaderContent = shouldRenderGenericHeaderContent
		? HomePageHeaderContent
		: ProductPageHeaderContent

	return (
		<header className={s.root}>
			<LeftSideHeaderContent />
			<div className={s.rightSide}>
				<GiveFeedbackButton />
				<AuthenticationControls />
				<MobileMenuButton />
			</div>
		</header>
	)
}

export type { NavigationHeaderItem }
export default NavigationHeader
