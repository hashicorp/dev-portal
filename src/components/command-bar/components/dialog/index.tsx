import { useState } from 'react'
import { IconCommand16 } from '@hashicorp/flight-icons/svg-react/command-16'
import Badge from 'components/badge'
import { useCommandBar, CommandBarTag } from 'components/command-bar'
import Dialog from 'components/dialog'
import Tag from 'components/tag'
import { CommandBarDialogFooterProps, CommandBarDialogProps } from './types'
import s from './command-bar-dialog.module.css'

const CommandBarDialogHeader = () => {
	const { currentCommand, currentTags, removeTag } = useCommandBar()

	return (
		<div className={s.header}>
			<div className={s.icon}>{currentCommand.icon}</div>
			{currentTags.length > 0 ? (
				<div className={s.headerTags}>
					{currentTags.map((tag: CommandBarTag) => (
						<Tag
							key={tag.id}
							text={tag.text}
							onRemove={() => removeTag(tag.id)}
						/>
					))}
				</div>
			) : null}
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
	const { addTag, currentTags } = useCommandBar()
	const [inputValue, setInputValue] = useState('')

	return (
		<div className={s.body}>
			<label>Tag text:</label>
			<input onChange={(e) => setInputValue(e.target.value)} />
			<button
				onClick={() => {
					addTag({ id: currentTags.length.toString(), text: inputValue })
				}}
			>
				add tag
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
