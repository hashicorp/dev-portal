import React, { ReactElement } from 'react'
import classNames from 'classnames'
import InlineSvg from '@hashicorp/react-inline-svg'
import svgHashicorpLogo from '@hashicorp/mktg-logos/corporate/hashicorp/primary/black.svg?include'
import Text from 'components/text'
import { FEEDBACK_FORM_URL } from 'constants/feedback-form'
import { FooterItem, FooterProps } from './types'
import s from './footer.module.css'

const FOOTER_ITEMS: FooterItem[] = [
	{
		type: 'link',
		href: FEEDBACK_FORM_URL,
		text: 'Give Feedback',
		opensInNewTab: true,
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
		href: 'https://www.hashicorp.com/security',
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
]

function Footer({
	openConsentManager,
	className,
}: FooterProps): React.ReactElement {
	return (
		<footer className={classNames(s.root, className)}>
			<a
				href="https://www.hashicorp.com/"
				aria-label="Go to HashiCorp home page"
			>
				<InlineSvg className={s.logo} src={svgHashicorpLogo} />
			</a>
			<ul className={s.links}>
				{FOOTER_ITEMS.map((item, index) => {
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
							// Note: we do follow this rule, eslint just doesn't recognize it
							// eslint-disable-next-line react/jsx-no-target-blank
							<a
								className={s.linkAction}
								href={item.href}
								target={item.opensInNewTab ? '_blank' : undefined}
								rel={item.opensInNewTab ? 'noreferrer' : undefined}
							>
								{textElement}
							</a>
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
						<li className={s.linkListItem} key={index}>
							{innerElement}
						</li>
					)
				})}
			</ul>
		</footer>
	)
}

export default Footer
