import {
	useInstantSearch,
	useMenu,
	useRefinementList,
	useToggleRefinement,
} from 'react-instantsearch-hooks-web'
import { RESOURCES } from '../../constants'

export function useFiltersState() {
	const { refine: refineEdition } = useMenu({ attribute: 'edition' })
	const { refine: refineProduct } = useRefinementList({
		attribute: 'products',
		operator: 'and',
	})
	const { value: hasVideoValue, refine: refineHasVideo } = useToggleRefinement({
		attribute: 'hasVideo',
	})
	const { value: isInteractiveValue, refine: refineIsInteractive } =
		useToggleRefinement({
			attribute: 'isInteractive',
		})
	const { indexUiState } = useInstantSearch()

	const selectedProducts = indexUiState?.refinementList?.products ?? []
	const selectedEdition = indexUiState?.menu?.edition

	const resources = RESOURCES.map((resource) => {
		if (resource.attribute === 'hasVideo') {
			return {
				...resource,
				value: hasVideoValue,
				refine: refineHasVideo,
			}
		}

		if (resource.attribute === 'isInteractive') {
			return {
				...resource,
				value: isInteractiveValue,
				refine: refineIsInteractive,
			}
		}
	})

	return {
		products: {
			refine: refineProduct,
			selectedProducts,
		},
		edition: {
			refine: refineEdition,
			selectedEdition,
		},
		resources: { resources },
	}
}
