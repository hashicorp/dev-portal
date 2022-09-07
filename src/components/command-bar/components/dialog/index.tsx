import classNames from 'classnames'
import { IconCommand16 } from '@hashicorp/flight-icons/svg-react/command-16'
import Badge from 'components/badge'
import { useCommandBar } from 'components/command-bar'
import Dialog from 'components/dialog'
import {
	CommandBarDialogBodyProps,
	CommandBarDialogFooterProps,
	CommandBarDialogHeaderProps,
	CommandBarDialogProps,
} from './types'
import s from './command-bar-dialog.module.css'
import { SupportedCommand } from 'components/command-bar/types'

const CommandBarDialogHeader = ({ className }: CommandBarDialogHeaderProps) => {
	const { currentCommand } = useCommandBar()

	return (
		<div className={classNames(s.header, className)}>
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

const CommandBarDialogBody = ({ className }: CommandBarDialogBodyProps) => {
	const { currentCommand, setCurrentCommand } = useCommandBar()

	return (
		<div className={classNames(s.body, className)}>
			<button
				onClick={() =>
					setCurrentCommand(
						currentCommand.name === SupportedCommand.search
							? SupportedCommand.search
							: SupportedCommand.settings
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

export type {
	CommandBarDialogBodyProps,
	CommandBarDialogFooterProps,
	CommandBarDialogHeaderProps,
	CommandBarDialogProps,
}
export {
	CommandBarDialog,
	CommandBarDialogHeader,
	CommandBarDialogBody,
	CommandBarDialogFooter,
}
