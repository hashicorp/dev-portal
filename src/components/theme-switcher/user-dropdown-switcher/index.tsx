import { ThemeSelectWithLabel } from 'components/theme-switcher'
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
				<ThemeSelectWithLabel id="theme-switcher-user-dropdown" />
			</DropdownDisclosureListItem>
		</>
	)
}
