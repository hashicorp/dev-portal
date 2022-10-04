// Third-party imports
import { ForwardedRef, forwardRef } from 'react'
import classNames from 'classnames'
import { m, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/router'

// HashiCorp imports
import { IconSignIn16 } from '@hashicorp/flight-icons/svg-react/sign-in-16'
import { IconUserPlus16 } from '@hashicorp/flight-icons/svg-react/user-plus-16'

// Global imports
import { getUserMenuItems } from 'lib/auth/user'
import { useMobileMenu } from 'contexts'
import useAuthentication from 'hooks/use-authentication'
import Button from 'components/button'
import ButtonLink from 'components/button-link'
import { GiveFeedbackButton } from 'components/navigation-header/components'

// Local imports
import { MobileMenuContainerProps } from './types'
import { MobileUserDisclosure } from './components'
import s from './mobile-menu-container.module.css'

// Constants
const MOBILE_MENU_MOTION = {
	visible: {
		left: 0,
		display: 'flex',
	},
	hidden: {
		left: '-150vw',
		transitionEnd: {
			display: 'none',
		},
	},
}

/**
 * Handles rendering the Sign In and Sign Up UI elements in mobile viewports.
 * Intended to be used alongside `MobileMenuContainer`.
 */
const MobileAuthenticationControls = () => {
	const { asPath } = useRouter()
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
					size="medium"
					text="Sign In"
				/>
				<ButtonLink
					color="secondary"
					href="/sign-up"
					icon={<IconUserPlus16 />}
					iconPosition="trailing"
					size="medium"
					text="Sign Up"
				/>
			</>
		)
	} else if (showAuthenticatedUI) {
		content = (
			<MobileUserDisclosure
				items={getUserMenuItems({ signOut })}
				user={user}
				initialOpen={asPath.startsWith('/profile')}
			/>
		)
	}

	return (
		<div className="g-show-with-mobile-menu">
			<GiveFeedbackButton
				allowIconOnly={false}
				className={s.giveFeedbackButton}
			/>
			<div className={s.mobileAuthenticationControls}>{content}</div>
		</div>
	)
}

// eslint-disable-next-line react/display-name
const MobileMenuContainer = forwardRef(
	(
		{ children, className }: MobileMenuContainerProps,
		ref: ForwardedRef<HTMLDivElement>
	) => {
		const { mobileMenuIsOpen } = useMobileMenu()
		const shouldReduceMotion = useReducedMotion()

		return (
			<m.div
				animate={mobileMenuIsOpen ? 'visible' : 'hidden'}
				className={classNames(s.root, className)}
				ref={ref}
				transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
				variants={MOBILE_MENU_MOTION}
			>
				{children}
			</m.div>
		)
	}
)

export type { MobileMenuContainerProps }
export { MobileAuthenticationControls }
export default MobileMenuContainer
