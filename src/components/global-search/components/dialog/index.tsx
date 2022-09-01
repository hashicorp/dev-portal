import { useMemo, useState } from 'react'
import { IconSearch24 } from '@hashicorp/flight-icons/svg-react/search-24'
import { useCurrentProduct, useGlobalSearch } from 'contexts'
import Dialog from 'components/dialog'
import SuggestedPagesList from '../suggested-pages-list'
import { getSuggestedPages } from './helpers/get-suggested-pages'
import s from './global-search-dialog.module.css'
import Tag from 'components/tag'
import { ProductData } from 'types/products'

const GlobalSearchDialog = () => {
	const currentProduct = useCurrentProduct()
	const { isGlobalSearchEnabled, searchIsOpen, toggleSearchIsOpen } =
		useGlobalSearch()

	// TODO put in a Context
	const [productFilter, setProductFilter] =
		useState<ProductData>(currentProduct)

	// variables based on state
	const suggestedPages = useMemo(
		() => getSuggestedPages(productFilter),
		[productFilter]
	)

	if (!isGlobalSearchEnabled) {
		return null
	}

	return (
		<Dialog
			contentClassName={s.content}
			isOpen={searchIsOpen}
			onDismiss={() => {
				toggleSearchIsOpen()
				setProductFilter(currentProduct)
			}}
		>
			<div className={s.contentInner}>
				<div className={s.header}>
					<IconSearch24 />
					{productFilter ? (
						<Tag
							onRemove={() => setProductFilter(null)}
							text={productFilter.name}
						/>
					) : null}
				</div>
				<div className={s.body}>
					<SuggestedPagesList suggestedPages={suggestedPages} />
				</div>
				<div className={s.footer}>footer</div>
			</div>
		</Dialog>
	)
}

export default GlobalSearchDialog
