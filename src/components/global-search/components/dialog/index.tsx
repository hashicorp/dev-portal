import { useEffect, useMemo, useState } from 'react'
import { IconSearch24 } from '@hashicorp/flight-icons/svg-react/search-24'
import { ProductData } from 'types/products'
import { useCurrentProduct, useGlobalSearch } from 'contexts'
import Dialog from 'components/dialog'
import Tag from 'components/tag'
import SuggestedPagesList from '../suggested-pages-list'
import { getSuggestedPages } from './helpers/get-suggested-pages'
import s from './global-search-dialog.module.css'

const GlobalSearchDialog = () => {
	const currentProduct = useCurrentProduct()
	const { isGlobalSearchEnabled, searchIsOpen, toggleSearchIsOpen } =
		useGlobalSearch()

	// TODO put in a Context
	const [productFilter, setProductFilter] =
		useState<ProductData>(currentProduct)
	const [searchQuery, setSearchQuery] = useState<string>('')

	// variables based on state
	const suggestedPages = useMemo(
		() => getSuggestedPages(productFilter),
		[productFilter]
	)

	/**
	 * Set the product filter if:
	 * - currentProduct changes
	 * - on open/close of dialog
	 */
	useEffect(() => {
		setProductFilter(currentProduct)
	}, [currentProduct, searchIsOpen])

	if (!isGlobalSearchEnabled) {
		return null
	}

	return (
		<Dialog
			contentClassName={s.content}
			isOpen={searchIsOpen}
			onDismiss={() => toggleSearchIsOpen()}
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
					<input
						autoFocus
						className={s.searchInput}
						// TODO figure out style for type="search"
						// type="search"
						placeholder="Search..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={
							productFilter
								? (e) => {
										if (e.key === 'Backspace' && !searchQuery) {
											setProductFilter(null)
										}
								  }
								: undefined
						}
					/>
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
