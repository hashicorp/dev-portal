import { ProductData } from 'types/products'
import {
	CommandBarContextState,
	CommandBarTag,
} from 'components/command-bar/types'

interface GetCurrentProductTagArguments {
	currentProduct: ProductData
	currentTags: CommandBarContextState['currentTags']
}

const getCurrentProductTag = ({
	currentProduct,
	currentTags,
}: GetCurrentProductTagArguments) => {
	return currentProduct
		? currentTags.find((tag: CommandBarTag) => tag.id === currentProduct.slug)
		: undefined
}

export { getCurrentProductTag }
