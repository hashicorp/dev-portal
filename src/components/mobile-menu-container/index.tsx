import { ForwardedRef, forwardRef } from 'react'
import classNames from 'classnames'
import { m, useReducedMotion } from 'framer-motion'
import { IconUserPlus16 } from '@hashicorp/flight-icons/svg-react/user-plus-16'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { useMobileMenu } from 'contexts'
import useAuthentication from 'hooks/use-authentication'
import Button from 'components/button'
import ButtonLink from 'components/button-link'
import { MobileMenuContainerProps } from './types'
import s from './mobile-menu-container.module.css'

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
 *
 * @TODO Render user dropdown disclosure for authenticated users
 * ref: https://app.asana.com/0/1202097197789424/1202665629707469/f
 */
const MobileAuthenticationControls = () => {
	const { isAuthEnabled, isAuthenticated, isLoading, signIn } =
		useAuthentication()
	const shouldShowAuthButtons = isAuthEnabled && !isLoading && !isAuthenticated

	if (!shouldShowAuthButtons) {
		return null
	}

	return (
		<div className={s.mobileAuthenticationControls}>
			<ButtonLink
				href="/sign-up"
				icon={<IconUserPlus16 />}
				iconPosition="trailing"
				size="small"
				text="Sign Up"
			/>
			<Button
				color="secondary"
				icon={<IconArrowRight16 />}
				iconPosition="trailing"
				onClick={() => signIn()}
				size="small"
				text="Sign In"
			/>
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
