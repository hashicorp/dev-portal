import { ChangeEvent, useId } from 'react'
import s from './textarea-input.module.css'

/**
 * A basic unstyled textarea input.
 *
 * This is a temporary solution for being able to input and edit long file
 * strings. Ideally, we'd use something like `codemirror` instead, but for now,
 * this felt sufficient for an internal preview tool for OpenAPI specs.
 */
export function TextareaInput({
	label,
	value,
	setValue,
}: {
	label: string
	value: string
	setValue: (value) => void
}) {
	const id = useId()
	return (
		<div className={s.root}>
			<label htmlFor={id}>{label}</label>
			<textarea
				id={id}
				value={value}
				className={s.textarea}
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
					setValue(e.target.value)
				}
			/>
		</div>
	)
}
