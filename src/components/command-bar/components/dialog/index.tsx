import Dialog from 'components/dialog'
import {
	CommandBarDialogBodyProps,
	CommandBarDialogFooterProps,
	CommandBarDialogHeaderProps,
	CommandBarDialogProps,
} from './types'
import s from './command-bar-dialog.module.css'
import classNames from 'classnames'

const CommandBarDialogHeader = ({
	children,
	className,
}: CommandBarDialogHeaderProps) => {
	return <div className={classNames(s.header, className)}>{children}</div>
}

const CommandBarDialogBody = ({ children }: CommandBarDialogBodyProps) => {
	return <div className={s.body}>{children}</div>
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
