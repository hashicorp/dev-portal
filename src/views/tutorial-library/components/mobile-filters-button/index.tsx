import { IconSliders16 } from '@hashicorp/flight-icons/svg-react/sliders-16'
import Button from 'components/button'

export function MobileFiltersButton({ onClick }) {
	return (
		<Button
			text="Filters"
			icon={<IconSliders16 />}
			color="secondary"
			className="g-show-with-mobile-menu"
			onClick={onClick}
		/>
	)
}
