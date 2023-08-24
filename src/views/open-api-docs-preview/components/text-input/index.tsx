import { useId } from 'react'
import s from './text-input.module.css'

export function TextInput({
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
			<input
				id={id}
				type="text"
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
		</div>
	)
}
