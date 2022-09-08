import { useEffect } from 'react'
import { IconSearch24 } from '@hashicorp/flight-icons/svg-react/search-24'
import { useCurrentProduct } from 'contexts'
import {
	CommandBarCommand,
	SupportedCommand,
} from 'components/command-bar/types'
import { useCommandBar } from 'components/command-bar'

const useOnInitialLoad = () => {
	const currentProduct = useCurrentProduct()
	const { addTag } = useCommandBar()

	useEffect(() => {
		if (currentProduct) {
			addTag({ id: currentProduct.slug, text: currentProduct.name })
		}
	}, [addTag, currentProduct])
}

const searchCommand: CommandBarCommand = {
	name: SupportedCommand.search,
	icon: <IconSearch24 />,
	inputProps: {
		placeholder: 'Search...',
	},
	useOnInitialLoad,
}

export default searchCommand
