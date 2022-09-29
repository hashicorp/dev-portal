import { IconCommand16 } from '@hashicorp/flight-icons/svg-react/command-16'
import Badge from 'components/badge'
import { useCommandBar, CommandBarTag } from 'components/command-bar'
import Tag from 'components/tag'
import { ChangeEvent } from 'react'
import s from './command-bar-dialog.module.css'

const CommandBarDialogHeader = () => {
	const {
		currentCommand,
		currentInputValue,
		currentTags,
		inputRef,
		removeTag,
		setCurrentInputValue,
	} = useCommandBar()

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
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setCurrentInputValue(e.target.value)
				}
				placeholder={currentCommand.inputProps.placeholder}
				ref={inputRef}
				value={currentInputValue}
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

export default CommandBarDialogHeader
