import { useId } from 'react'
import s from './textarea-input.module.css'

export function TextareaInput({
	label,
	value,
	setValue,
}: {
	label: string
	value: string
	setValue: (value: string) => void
}) {
	const id = useId()

	return (
		<div className={s.root}>
			<label htmlFor={id}>{label}</label>
			<textarea
				style={{ width: '100%', height: '200px', resize: 'vertical' }}
				id={id}
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
		</div>
	)
}
