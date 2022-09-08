import { useCommandBar } from 'components/command-bar'
import Dialog from 'components/dialog'
import { CommandBarDialogFooterProps, CommandBarDialogProps } from './types'
import CommandBarDialogHeader from './header'
import CommandBarDialogFooter from './footer'
import CommandBarDialogBody from './body'
import s from './command-bar-dialog.module.css'

const CommandBarDialog = ({
	isOpen = false,
	onDismiss = () => null,
}: CommandBarDialogProps) => {
	// Get the current command from Command Bar state
	const { currentCommand } = useCommandBar()

	// Invoke currnet command's initial loading hook
	const { useOnInitialLoad = () => null } = currentCommand
	useOnInitialLoad()

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

export type { CommandBarDialogFooterProps, CommandBarDialogProps }
export { CommandBarDialog }
