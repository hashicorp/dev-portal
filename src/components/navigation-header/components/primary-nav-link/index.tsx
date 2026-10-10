/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import useCurrentPath from 'hooks/use-current-path'
import Link from 'components/link'
import Text from 'components/text'
import s from './primary-nav-link.module.css'
import ButtonLink from '@components/button-link'
import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'
import { trackNavClickEvent } from 'lib/posthog-events'

import { ReactElement } from 'react'

export interface PrimaryNavLinkProps {
	ariaLabel: string
	navItem: {
		label: string
		url: string
		opensInNewTab?: boolean
		isPrimary?: boolean
		icon?: ReactElement
		iconPosition?: 'trailing' | 'leading'
	}
}

const PrimaryNavLink = ({ ariaLabel, navItem }: PrimaryNavLinkProps) => {
	const { label, url, opensInNewTab, isPrimary, icon, iconPosition } = navItem
	const currentProduct = useCurrentProduct()
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const isCurrentPage = url === currentPath || url === `${currentPath}/`
	const isCurrentPageInPath = currentPath.startsWith(url) && url !== '/'

	// There is an edge case where the 'Documentation' tab was highlighted incorrectly
	// for vault and boundary since some of the docs sub-paths have their own nav link.
	// These two edge case conditions check for these paths. If future nav links are added
	// that run into this scenario, an edge case will need to be added here.
	const vaultEdgeCase =
		currentProduct?.name === 'Vault' &&
		currentPath.startsWith('/vault/docs/commands') &&
		url === '/vault/docs'
	const boundaryEdgeCase =
		currentProduct?.name === 'Boundary' &&
		(currentPath.startsWith('/boundary/docs/commands') ||
			currentPath.startsWith('/boundary/docs/domain-model')) &&
		url === '/boundary/docs'
	const certificationsEdgeCase =
		currentPath.startsWith('/certifications') &&
		currentPath !== '/certifications'
	const shouldLinkBeUnderlined =
		isCurrentPageInPath &&
		!vaultEdgeCase &&
		!boundaryEdgeCase &&
		!certificationsEdgeCase

	if (opensInNewTab) {
		return (
			<ButtonLink
				aria-current={isCurrentPage ? 'page' : undefined}
				aria-label={ariaLabel}
				color={isPrimary ? 'primary' : 'secondary'}
				href={url}
				opensInNewTab={opensInNewTab}
				icon={icon ?? icon}
				iconPosition={iconPosition ?? 'leading'}
				text={label}
				onClickCapture={() => {
					trackNavClickEvent(label, url)
				}}
			/>
		)
	}

	return (
		<Link
			aria-current={isCurrentPage ? 'page' : undefined}
			aria-label={ariaLabel}
			className={classNames(s.root, {
				[s.underline]: shouldLinkBeUnderlined,
			})}
			href={url}
			opensInNewTab={opensInNewTab}
			onClickCapture={() => {
				trackNavClickEvent(label, url)
			}}
		>
			<Text asElement="span" className={s.linkText} size={200} weight="medium">
				{label}
			</Text>
			{opensInNewTab ? <IconExternalLink16 /> : null}
		</Link>
	)
}

export default PrimaryNavLink
