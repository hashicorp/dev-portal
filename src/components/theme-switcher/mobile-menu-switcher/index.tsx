import ThemeSwitcher from 'components/theme-switcher'
import s from './mobile-menu-switcher.module.css'

export default function MobileMenuThemeSwitcher() {
	const switcherId = 'theme-switcher-mobile-menu'
	return (
		<div>
			<label className={s.label} htmlFor={switcherId}>
				Theme
			</label>
			<ThemeSwitcher id={switcherId} />
		</div>
	)
}
