import Dialog from 'components/dialog'
import { CommandBarDialogProps } from './types'
import CommandBarDialogHeader from './header'
import CommandBarDialogFooter from './footer'
import CommandBarDialogBody from './body'
import s from './command-bar-dialog.module.css'

const CommandBarDialog = ({
	isOpen = false,
	onDismiss = () => null,
}: CommandBarDialogProps) => {
	return (
		<Dialog contentClassName={s.content} isOpen={isOpen} onDismiss={onDismiss}>
			<div className={s.contentInner}>
				<CommandBarDialogHeader />
				<CommandBarDialogBody />
				<CommandBarDialogFooter />
			</div>
		</Dialog>
	)
}

export type { CommandBarDialogProps }
export { CommandBarDialog }
