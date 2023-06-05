/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { NavigationHeaderItem } from 'components/navigation-header/types'
import { ProductSlug } from 'types/products'
import { NavigationHeaderDropdownMenu } from '..'
import s from './primary-nav-submenu.module.css'

export interface PrimaryNavSubmenuProps {
	ariaLabel: string
	navItem: {
		iconColorTheme: ProductSlug
		items: NavigationHeaderItem[]
		label: string
	}
}

const PrimaryNavSubmenu = ({ ariaLabel, navItem }: PrimaryNavSubmenuProps) => {
	const { iconColorTheme, items, label } = navItem

	return (
		<NavigationHeaderDropdownMenu
			ariaLabel={ariaLabel}
			iconClassName={classNames(
				s.primarySubnavDropdownItemIcon,
				iconColorTheme
			)}
			itemGroups={[{ items }]}
			label={label}
		/>
	)
}

export default PrimaryNavSubmenu
