/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ThemeSwitcherWithLabel } from 'components/theme-switcher'
import {
	DropdownDisclosureListItem,
	DropdownDisclosureSeparatorItem,
} from 'components/dropdown-disclosure'
import s from './user-dropdown-switcher.module.css'

export default function UserDropdownDisclosureThemeSwitcher() {
	return (
		<>
			<DropdownDisclosureSeparatorItem />
			<DropdownDisclosureListItem className={s.listItem}>
				<ThemeSwitcherWithLabel />
			</DropdownDisclosureListItem>
		</>
	)
}
