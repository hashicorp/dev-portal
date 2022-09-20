import Button, { ButtonProps } from 'components/button'
import { useClearRefinements } from 'react-instantsearch-hooks-web'

import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'

interface ClearFiltersButtonProps {
	color?: ButtonProps['color']
	className?: string
}

/**
 * Uses [userClearRefinements](https://www.algolia.com/doc/api-reference/widgets/clear-refinements/react-hooks/#hook) to handle wiping the filter state within Algolia.
 */
export function ClearFiltersButton({
	color = 'tertiary',
	className,
}: ClearFiltersButtonProps) {
	const { refine, canRefine } = useClearRefinements()

	if (!canRefine) {
		return null
	}

	return (
		<Button
			className={className}
			text="Clear Filters"
			icon={<IconX16 />}
			color={color}
			size="small"
			onClick={() => refine()}
		/>
	)
}
