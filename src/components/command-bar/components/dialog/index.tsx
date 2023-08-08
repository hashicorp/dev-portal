/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { type PropsWithChildren } from 'react'
import Dialog from 'components/dialog'
import useWindowSize from 'hooks/use-window-size'
import s from './command-bar-dialog.module.css'
import { useCommandBar } from 'components/command-bar'

import CommandBarDialogHeader from './header'
import CommandBarDialogFooter from './footer'
import CommandBarDialogBody from './body'

type CommandBarDialogProps = PropsWithChildren<{
	isOpen?: boolean
	onDismiss?: () => void
	instructionsElementId?: string
}>

const CommandBarDialog = ({
	isOpen = false,
	onDismiss = () => null,
	children,
}: CommandBarDialogProps) => {
	const { width } = useWindowSize()
	const { instructionsElementId } = useCommandBar()

	return (
		<Dialog
			ariaDescribedBy={instructionsElementId}
			label="Command Bar"
			contentClassName={s.content}
			isOpen={isOpen}
			onDismiss={onDismiss}
			variant={width <= 728 ? 'bottom' : null}
		>
			<div className={s.contentInner}>{children}</div>
		</Dialog>
	)
}

/**
 * composable export
 *
 * @example
 * ```tsx
 * <Command.Dialog>
 *   <Command.Header/>
 *   <Command.Body/>
 *   <Command.Footer/>
 * </Command.Dialog>
 */
export default Object.assign(
	{},
	{
		Dialog: CommandBarDialog,
		Header: CommandBarDialogHeader,
		Body: CommandBarDialogBody,
		Footer: CommandBarDialogFooter,
	}
)
