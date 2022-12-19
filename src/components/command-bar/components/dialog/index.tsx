import Dialog from 'components/dialog'
import useWindowSize from 'hooks/use-window-size'
import { CommandBarDialogProps } from './types'
import CommandBarDialogHeader from './header'
import CommandBarDialogFooter from './footer'
import CommandBarDialogBody from './body'
import s from './command-bar-dialog.module.css'

const CommandBarDialog = ({
	isOpen = false,
	onDismiss = () => null,
}: CommandBarDialogProps) => {
	const { width } = useWindowSize()
	const instructionsElementId = 'footer-keyboard-instructions'

	return (
		<Dialog
			ariaDescribedBy={instructionsElementId}
			label="Command Bar"
			contentClassName={s.content}
			isOpen={isOpen}
			onDismiss={onDismiss}
			variant={width <= 728 ? 'bottom' : null}
		>
			<div className={s.contentInner}>
				<CommandBarDialogHeader />
				<CommandBarDialogBody />
				<CommandBarDialogFooter instructionsElementId={instructionsElementId} />
			</div>
		</Dialog>
	)
}

export type { CommandBarDialogProps }
export { CommandBarDialog }
