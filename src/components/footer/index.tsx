/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import InlineSvg from '@hashicorp/react-inline-svg'
import svgHashicorpLogo from 'lib/mktg-logos/hashicorp-horizontal_on-light.svg?include'
import Text from 'components/text'
import { FEEDBACK_FORM_URL } from 'constants/feedback-form'
import { ThemeSwitcherWithLabel } from 'components/theme-switcher'
import Link from 'components/link'
import isThemedPath from 'lib/isThemedPath'
import { FooterItem, FooterProps } from './types'
import s from './footer.module.css'

const FOOTER_ITEMS: FooterItem[] = [
	{
		type: 'link',
		href: '/certifications',
		text: 'Certifications',
	},
	{
		type: 'link',
		href: 'https://status.hashicorp.com',
		text: 'System Status',
	},
	{
		type: 'consent-manager',
		text: 'Cookie Manager',
	},
	{
		type: 'link',
		href: 'https://www.hashicorp.com/terms-of-service',
		text: 'Terms of Use',
	},
	{
		type: 'link',
		href: 'https://www.hashicorp.com/trust/security',
		text: 'Security',
	},
	{
		type: 'link',
		href: 'https://www.hashicorp.com/privacy',
		text: 'Privacy',
	},
	{
		type: 'link',
		href: 'https://www.hashicorp.com/trademark-policy',
		text: 'Trademark Policy',
	},
	{
		type: 'link',
		href: 'https://www.hashicorp.com/trade-controls',
		text: 'Trade Controls',
	},
	{
		type: 'link',
		href: 'https://www.hashicorp.com/trust/accessibility',
		text: 'Accessibility',
	},
	{
		type: 'link',
		href: FEEDBACK_FORM_URL,
		text: 'Give Feedback',
		opensInNewTab: true,
	},
]

function Footer({
	openConsentManager,
	className,
}: FooterProps): React.ReactElement {
	const { pathname } = useRouter()
	const shouldRenderThemeSwitcher = isThemedPath(pathname)

	return (
		<footer
			className={classNames(
				s.root,
				className,
				!shouldRenderThemeSwitcher && s.row
			)}
		>
			<span className={s.logoAndSwitcher}>
				<a
					href="https://www.hashicorp.com/"
					aria-label="Go to HashiCorp home page"
					className={s.logo}
				>
					<InlineSvg src={svgHashicorpLogo} />
				</a>
				{shouldRenderThemeSwitcher ? (
					<span className={s.themeSwitcher}>
						<ThemeSwitcherWithLabel />
					</span>
				) : null}
			</span>
			<ul className={s.links}>
				{FOOTER_ITEMS.map((item: FooterItem, index: number) => {
					/**
					 * Ignore the consent-manager footer item if the `openConsentManager`
					 * prop has not been supplied to the component.
					 */
					if (item.type === 'consent-manager' && !openConsentManager) {
						return null
					}

					/**
					 * Declare the text element to place in the inner element, using the
					 * Text component to ensure consistent font size and weight.
					 */
					const textElement = (
						<Text asElement="span" size={200} weight="regular">
							{item.text}
						</Text>
					)

					/**
					 * Declare the element to render directly within the <li>. Based on
					 * the `type` for each FOOTER_ITEM.
					 */
					let innerElement: ReactElement
					if (item.type === 'link') {
						innerElement = (
							<Link
								className={s.linkAction}
								href={item.href}
								opensInNewTab={item.opensInNewTab}
							>
								{textElement}
								{item.opensInNewTab ? <IconExternalLink16 /> : null}
							</Link>
						)
					} else if (item.type === 'consent-manager') {
						innerElement = (
							<button className={s.linkAction} onClick={openConsentManager}>
								{textElement}
							</button>
						)
					}

					return (
						// eslint-disable-next-line react/no-array-index-key
						<li key={index}>{innerElement}</li>
					)
				})}
			</ul>
		</footer>
	)
}

export default Footer
