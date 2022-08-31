import { useGlobalSearch } from 'contexts'
import Dialog from 'components/dialog'
import s from './global-search-dialog.module.css'

const GlobalSearchDialog = () => {
	const { isGlobalSearchEnabled, searchIsOpen, toggleSearchIsOpen } =
		useGlobalSearch()

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
				<div className={s.header}>header</div>
				<div className={s.body}>body</div>
				<div className={s.footer}>footer</div>
			</div>
		</Dialog>
	)
}

export default GlobalSearchDialog
