/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import { IconCloud16 } from '@hashicorp/flight-icons/svg-react/cloud-16'
import useCurrentPath from 'hooks/use-current-path'
import Link from 'components/link'
import Text from 'components/text'
import s from './primary-nav-link.module.css'
import ButtonLink from '@components/button-link'
import classNames from 'classnames'
import { useCurrentProduct } from 'contexts'

export interface PrimaryNavLinkProps {
	ariaLabel: string
	navItem: {
		label: string
		url: string
		opensInNewTab?: boolean
		isPrimary?: boolean
	}
}

const PrimaryNavLink = ({ ariaLabel, navItem }: PrimaryNavLinkProps) => {
	const { label, url, opensInNewTab, isPrimary } = navItem
	const currentProduct = useCurrentProduct()
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const isCurrentPage = url === currentPath || url === `${currentPath}/`
	const isCurrentPageInPath = currentPath.startsWith(url) && url !== '/'
	// There is an edge case where the 'Documentation' tab was highlighted incorrectly
	// for vault and boundary since some of the docs sub-paths have their own nav link.
	// These two edge case conditions check for these paths. If future nav links are added 
	// that run into this scenario, an edge case will need to be added here.
	const vaultEdgeCase =
		currentProduct.name === 'Vault' &&
		currentPath.startsWith('/vault/docs/commands') &&
		url === '/vault/docs'
	const boundaryEdgeCase =
		currentProduct.name === 'Boundary' &&
		(currentPath.startsWith('/boundary/docs/commands') ||
			currentPath.startsWith('/boundary/docs/domain-model')) &&
		url === '/boundary/docs'
	const shouldLinkBeUnderlined = isCurrentPageInPath && !vaultEdgeCase && !boundaryEdgeCase
	const iaPosthogVariant = true // TODO: Replace with actual PostHog experiment variant check when available

	if (opensInNewTab && iaPosthogVariant) {
		return (
			<ButtonLink
				aria-current={isCurrentPage ? 'page' : undefined}
				aria-label={ariaLabel}
				color={isPrimary ? 'primary' : 'secondary'}
				href={url}
				opensInNewTab={opensInNewTab}
				icon={isPrimary ? <IconCloud16 /> : <IconExternalLink16 />}
				text={label}
			/>
		)
	}

	return (
		<Link
			aria-current={isCurrentPage ? 'page' : undefined}
			aria-label={ariaLabel}
			className={classNames(s.root, {
				[s.underline]: shouldLinkBeUnderlined && iaPosthogVariant,
				[s.iaLink]: iaPosthogVariant,
			})}
			href={url}
			opensInNewTab={opensInNewTab}
		>
			<Text asElement="span" className={s.linkText} size={200} weight="medium">
				{label}
			</Text>
			{opensInNewTab ? <IconExternalLink16 /> : null}
		</Link>
	)
}

export default PrimaryNavLink
