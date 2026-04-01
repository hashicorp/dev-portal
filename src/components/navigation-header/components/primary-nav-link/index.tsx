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
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const isCurrentPage = url === currentPath || url === `${currentPath}/`

	if (opensInNewTab) {
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
			className={s.root}
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
