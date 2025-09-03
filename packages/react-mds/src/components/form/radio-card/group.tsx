import { Fieldset } from '../fieldset'
import type { ComponentProps, ReactNode } from 'react'
import s from './form-radio-card.module.css'

export interface RadioCardGroupProps extends ComponentProps<typeof Fieldset> {
	children: ReactNode
	legend: ReactNode
}

function RadioCardGroup({
	layout = 'horizontal',
	isRequired,
	isOptional,
	error,
	legend,
	helperText,
	children,
	...rest
}: RadioCardGroupProps) {
	return (
		<Fieldset
			className={s['radio-cards']}
			layout={layout}
			legend={legend}
			isOptional={isOptional}
			isRequired={isRequired}
			helperText={helperText}
			error={error}
			{...rest}
		>
			{children}
		</Fieldset>
	)
}

export default RadioCardGroup
