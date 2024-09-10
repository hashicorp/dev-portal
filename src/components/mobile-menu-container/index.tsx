/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ForwardedRef, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'
import { m, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/router'

// Global imports
import { getUserMenuItems } from 'lib/auth/user'
import isThemedPath from 'lib/isThemedPath'
import { useMobileMenu } from 'contexts'
import useAuthentication from 'hooks/use-authentication'
import Button from 'components/button'
import ButtonLink from 'components/button-link'

// Local imports
import { ThemeSwitcherWithLabel } from 'components/theme-switcher'
import type { MobileMenuContainerProps } from './types'
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

const MobileAuthenticationControls = ({
	className,
}: HTMLAttributes<HTMLDivElement>) => {
	const { asPath } = useRouter()
	const { isAuthenticated, isLoading, signIn, signOut, user } =
		useAuthentication()
	const showUnauthenticatedUI = !isLoading && !isAuthenticated
	const { pathname } = useRouter()
	const shouldRenderThemeSwitcher = isThemedPath(pathname)

	if (!isAuthenticated && !showUnauthenticatedUI) {
		return null
	}

	let content
	if (showUnauthenticatedUI) {
		content = (
			<div className={s.unauthenticatedControls}>
				<div className={s.unauthenticatedControlButtons}>
					<Button onClick={() => signIn()} size="medium" text="Sign In" />
					<ButtonLink
						color="secondary"
						href="/sign-up"
						size="medium"
						text="Sign Up"
					/>
				</div>
				{shouldRenderThemeSwitcher ? (
					<div className={s.themeSwitcher}>
						<ThemeSwitcherWithLabel />
					</div>
				) : null}
			</div>
		)
	} else if (isAuthenticated) {
		content = (
			<MobileUserDisclosure
				items={getUserMenuItems({ signOut })}
				user={user}
				initialOpen={asPath.startsWith('/profile')}
			/>
		)
	}

	return (
		<div
			className={classNames(
				'g-show-with-mobile-menu',
				s.mobileAuthenticationControlsWrap,
				className
			)}
		>
			{content}
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
