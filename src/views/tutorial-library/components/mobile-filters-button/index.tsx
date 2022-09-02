import { IconSliders16 } from '@hashicorp/flight-icons/svg-react/sliders-16'
import Button from 'components/button'

import s from './mobile-filters-button.module.css'

export function MobileFiltersButton({ onClick }) {
	return (
		<Button
			text="Filters"
			icon={<IconSliders16 />}
			color="secondary"
			className={s.root}
			onClick={onClick}
		/>
	)
}
