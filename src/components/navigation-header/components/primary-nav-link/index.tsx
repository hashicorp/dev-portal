/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import useCurrentPath from 'hooks/use-current-path'
import Link from 'components/link'
import Text from 'components/text'
import s from './primary-nav-link.module.css'

export interface PrimaryNavLinkProps {
	ariaLabel: string
	navItem: {
		label: string
		url: string
		opensInNewTab?: boolean
	}
}

const PrimaryNavLink = ({ ariaLabel, navItem }: PrimaryNavLinkProps) => {
	const { label, url, opensInNewTab } = navItem
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const isCurrentPage = url === currentPath || url === `${currentPath}/`

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
