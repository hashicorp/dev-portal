import { useCurrentProduct, useGlobalSearch } from 'contexts'
import Dialog from 'components/dialog'
import SuggestedPagesList from '../suggested-pages-list'
import { getSuggestedPages } from './helpers/get-suggested-pages'
import s from './global-search-dialog.module.css'

const GlobalSearchDialog = () => {
	const currentProduct = useCurrentProduct()
	const { isGlobalSearchEnabled, searchIsOpen, toggleSearchIsOpen } =
		useGlobalSearch()

	if (!isGlobalSearchEnabled) {
		return null
	}

	const suggestedPages = getSuggestedPages(currentProduct)

	return (
		<Dialog
			contentClassName={s.content}
			isOpen={searchIsOpen}
			onDismiss={() => toggleSearchIsOpen()}
		>
			<div className={s.contentInner}>
				<div className={s.header}>header</div>
				<div className={s.body}>
					<SuggestedPagesList suggestedPages={suggestedPages} />
				</div>
				<div className={s.footer}>footer</div>
			</div>
		</Dialog>
	)
}

export default GlobalSearchDialog
