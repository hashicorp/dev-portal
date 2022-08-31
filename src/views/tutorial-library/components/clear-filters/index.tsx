import Button, { ButtonProps } from 'components/button'
import { useClearRefinements } from 'react-instantsearch-hooks-web'

import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'

interface ClearFiltersProps {
	color?: ButtonProps['color']
}

export function ClearFilters({ color = 'tertiary' }: ClearFiltersProps) {
	const { refine, canRefine } = useClearRefinements()

	if (!canRefine) {
		return null
	}

	return (
		<Button
			text="Clear Filters"
			icon={<IconX16 />}
			color={color}
			size="small"
			onClick={() => refine()}
		/>
	)
}
