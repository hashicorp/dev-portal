import { IconArrowDown16 } from '@hashicorp/flight-icons/svg-react/arrow-down-16'
import { IconArrowUp16 } from '@hashicorp/flight-icons/svg-react/arrow-up-16'
import { IconCommand16 } from '@hashicorp/flight-icons/svg-react/command-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Badge from 'components/badge'
import { useCommandBar, SupportedCommand } from 'components/command-bar'
import Dialog from 'components/dialog'
import { FORM_URL } from 'components/navigation-header/components/give-feedback-button'
import StandaloneLink from 'components/standalone-link'
import Text from 'components/text'
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

const CommandBarDialogFooter = () => {
	return (
		<div className={s.footer}>
			<div className={s.footerLeft}>
				<Badge color="neutral" text="Tab" type="outlined" size="small" />
				<Text asElement="span" size={100} weight="regular">
					or
				</Text>
				<div className={s.footerLeftArrowKeys}>
					<Badge
						ariaLabel="Up arrow key"
						color="neutral"
						icon={<IconArrowUp16 />}
						type="outlined"
						size="small"
					/>
					<Badge
						ariaLabel="Down arrow key"
						color="neutral"
						icon={<IconArrowDown16 />}
						type="outlined"
						size="small"
					/>
				</div>
				<Text asElement="span" size={100} weight="regular">
					to navigate,
				</Text>
				<Text asElement="span" size={100} weight="regular">
					to select,
				</Text>
				<Badge color="neutral" text="Esc" type="outlined" size="small" />
				<Text asElement="span" size={100} weight="regular">
					to exit
				</Text>
			</div>
			<div>
				<StandaloneLink
					color="secondary"
					href={FORM_URL}
					icon={<IconExternalLink16 />}
					iconPosition="trailing"
					size="small"
					text="Give Feedback"
					openInNewTab
				/>
			</div>
		</div>
	)
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
