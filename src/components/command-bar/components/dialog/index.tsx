import { IconCommand16 } from '@hashicorp/flight-icons/svg-react/command-16'
import Badge from 'components/badge'
import { useCommandBar, SupportedCommand } from 'components/command-bar'
import Dialog from 'components/dialog'
import { CommandBarDialogFooterProps, CommandBarDialogProps } from './types'
import s from './command-bar-dialog.module.css'

const CommandBarDialogHeader = () => {
	const { currentCommand } = useCommandBar()

	return (
		<div className={s.header}>
			<div className={s.icon}>{currentCommand.icon}</div>
			<input
				className={s.input}
				placeholder={currentCommand.inputProps.placeholder}
			/>
			<div className={s.badges}>
				<Badge
					ariaLabel="Command key"
					color="neutral"
					icon={<IconCommand16 />}
					size="small"
					type="outlined"
				/>
				<Badge
					ariaLabel="K key"
					color="neutral"
					size="small"
					text="K"
					type="outlined"
				/>
			</div>
		</div>
	)
}

const CommandBarDialogBody = () => {
	const { currentCommand, setCurrentCommand } = useCommandBar()

	return (
		<div className={s.body}>
			<button
				onClick={() =>
					setCurrentCommand(
						currentCommand.name === SupportedCommand.search
							? SupportedCommand.settings
							: SupportedCommand.search
					)
				}
			>
				Use{' '}
				{currentCommand.name === SupportedCommand.search
					? 'settings'
					: 'search'}{' '}
				command
			</button>
		</div>
	)
}

const CommandBarDialogFooter = ({ children }: CommandBarDialogFooterProps) => {
	return <div className={s.footer}>{children}</div>
}

const CommandBarDialog = ({
	children,
	isOpen = false,
	onDismiss = () => null,
}: CommandBarDialogProps) => {
	return (
		<Dialog contentClassName={s.content} isOpen={isOpen} onDismiss={onDismiss}>
			<div className={s.contentInner}>{children}</div>
		</Dialog>
	)
}

export type { CommandBarDialogFooterProps, CommandBarDialogProps }
export {
	CommandBarDialog,
	CommandBarDialogHeader,
	CommandBarDialogBody,
	CommandBarDialogFooter,
}
