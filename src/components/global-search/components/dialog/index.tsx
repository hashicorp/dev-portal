import { useGlobalSearch } from 'contexts'
import Dialog from 'components/dialog'
import s from './global-search-dialog.module.css'

const GlobalSearchDialog = () => {
	const { searchIsOpen, toggleSearchIsOpen } = useGlobalSearch()

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
