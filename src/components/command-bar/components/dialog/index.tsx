import Dialog from 'components/dialog'
import { CommandBarDialogProps } from './types'
import CommandBarDialogHeader from './header'
import CommandBarDialogFooter from './footer'
import CommandBarDialogBody from './body'
import s from './command-bar-dialog.module.css'
import useWindowSize from 'hooks/use-window-size'

const CommandBarDialog = ({
	isOpen = false,
	onDismiss = () => null,
}: CommandBarDialogProps) => {
	const { width } = useWindowSize()

	return (
		<Dialog
			contentClassName={s.content}
			// contentWrapperClassName={s.contentWrapper}
			isOpen={isOpen}
			onDismiss={onDismiss}
			variant={width <= 728 ? 'bottom' : null}
		>
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
