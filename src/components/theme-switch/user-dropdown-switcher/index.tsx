import ThemeSwitcher from 'components/theme-switch'
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
				<label className={s.label} htmlFor="theme-switcher">
					Theme
				</label>
				<ThemeSwitcher labelledById="theme-switcher" />
			</DropdownDisclosureListItem>
		</>
	)
}
