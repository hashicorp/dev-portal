import { useId } from '@react-aria/utils'
import { useState } from 'react'
import { CheckboxProps } from './types'
import s from './checkbox.module.css'

const Checkbox = ({
	id,
	initialIsChecked = false,
	label,
	name,
}: CheckboxProps) => {
	const inputId = useId(id)
	const [isChecked, setIsChecked] = useState<boolean>(initialIsChecked)

	return (
		<div className={s.root}>
			<input
				checked={isChecked}
				className={s.input}
				id={inputId}
				name={name}
				onChange={() => {
					setIsChecked((previouslyIsChecked: boolean) => !previouslyIsChecked)
				}}
				type="checkbox"
			/>
			<label className={s.label} htmlFor={inputId}>
				{label}
			</label>
		</div>
	)
}

export type { CheckboxProps }
export default Checkbox
