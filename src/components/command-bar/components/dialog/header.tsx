/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ChangeEvent } from 'react'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'
import { useCurrentProduct } from 'contexts'
import Badge from 'components/badge'
import { useCommandBar, CommandBarTag } from 'components/command-bar'
import { CmdCtrlIcon, KIcon } from 'components/command-bar/components'
import Tag from 'components/tag'
import s from './command-bar-dialog.module.css'

const CommandBarDialogHeader = () => {
	const currentProduct = useCurrentProduct()
	const commandBarState = useCommandBar()
	const {
		currentCommand,
		currentInputValue,
		currentTags,
		inputRef,
		removeTag,
		setCurrentInputValue,
		setCurrentCommand,
	} = commandBarState

	const inputPlaceholder = currentCommand.inputProps.placeholder({
		commandBarState,
		currentProduct,
	})

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
			<div className={s.inputWrapper}>
				{currentCommand.name !== 'chat' && (
					<input
						aria-label={inputPlaceholder}
						className={s.input}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setCurrentInputValue(e.target.value)
						}
						placeholder={inputPlaceholder}
						ref={inputRef}
						value={currentInputValue}
					/>
				)}

				{currentInputValue ? (
					<div className={s.clearButtonWrapper}>
						<button
							className={s.clearButton}
							onClick={() => {
								setCurrentInputValue('')
								inputRef?.current?.focus()
							}}
						>
							<IconX24 />
						</button>
					</div>
				) : null}
			</div>
			<div className={s.badges}>
				<Badge
					ariaLabel="Command key"
					color="neutral"
					icon={<CmdCtrlIcon />}
					size="small"
					type="outlined"
				/>
				<Badge
					ariaLabel="K key"
					color="neutral"
					icon={<KIcon />}
					size="small"
					type="outlined"
				/>
			</div>
		</div>
	)
}

export default CommandBarDialogHeader
