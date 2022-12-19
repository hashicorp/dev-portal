import { useClearRefinements } from 'react-instantsearch-hooks-web'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import Button, { ButtonProps } from 'components/button'

interface ClearFiltersButtonProps {
	color?: ButtonProps['color']
	className?: string
	/**
	 * Disables the button, instead of rendering null, when no filters are applied.
	 */
	disableWhenNoFilters?: boolean
}

/**
 * Uses [useClearRefinements](https://www.algolia.com/doc/api-reference/widgets/clear-refinements/react-hooks/#hook) to handle wiping the filter state within Algolia.
 */
export function ClearFiltersButton({
	color = 'tertiary',
	className,
	disableWhenNoFilters = false,
}: ClearFiltersButtonProps) {
	const { refine, canRefine } = useClearRefinements()

	if (!canRefine && !disableWhenNoFilters) {
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
			disabled={!canRefine}
		/>
	)
}
