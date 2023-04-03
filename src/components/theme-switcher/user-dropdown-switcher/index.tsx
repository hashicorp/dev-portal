import ThemeSwitcher from 'components/theme-switcher'
import {
	DropdownDisclosureListItem,
	DropdownDisclosureSeparatorItem,
} from 'components/dropdown-disclosure'
import s from './user-dropdown-switcher.module.css'

export default function UserDropdownDisclosureThemeSwitcher() {
	const switcherId = 'theme-switcher-user-dropdown'
	return (
		<>
			<DropdownDisclosureSeparatorItem />
			<DropdownDisclosureListItem className={s.listItem}>
				<label className={s.label} htmlFor={switcherId}>
					Theme
				</label>
				<ThemeSwitcher id={switcherId} />
			</DropdownDisclosureListItem>
		</>
	)
}
