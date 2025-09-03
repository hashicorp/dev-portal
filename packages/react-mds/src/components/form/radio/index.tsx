import {
	useId,
	type ComponentProps,
	type HTMLProps,
	type ReactNode,
} from 'react'
import { Field } from '../field'
import { Fieldset } from '../fieldset'
import classNames from 'classnames'
import s from './form-radio.module.scss'

interface RadioBaseProps {
	id: string
	required?: boolean
	field: HTMLProps<HTMLInputElement>
	className?: string
	testingKey?: string
}

const RadioBase = ({
	id,
	required,
	field,
	className,
	testingKey,
}: RadioBaseProps) => {
	return (
		<input
			id={id}
			type="radio"
			className={classNames(s.radio, className)}
			required={required}
			data-testid={testingKey}
			{...field}
		/>
	)
}

interface RadioFieldProps {
	isInvalid?: boolean
	isLoading?: boolean
	isRequired?: boolean
	isOptional?: boolean
	id?: string
	label?: ReactNode
	helperText?: ReactNode
	error?: ReactNode
	field: HTMLProps<HTMLInputElement>
	className?: string
	testingKey?: string
}

const RadioField = ({
	isInvalid,
	isLoading,
	isRequired,
	isOptional,
	id,
	label,
	helperText,
	error,
	field,
	className,
	testingKey,
	...rest
}: RadioFieldProps) => {
	const generatedId = useId()
	const inputId = id ?? generatedId

	return (
		<Field
			label={label}
			helperText={helperText}
			error={error}
			isRequired={isRequired}
			isOptional={isOptional}
			id={inputId}
			layout="flag"
			className={className}
		>
			<RadioBase
				id={inputId}
				required={isRequired}
				field={{ ...field, 'aria-describedby': `error-${id}` }}
				testingKey={testingKey}
				{...rest}
			/>
		</Field>
	)
}

interface RadioGroupProps extends ComponentProps<typeof Fieldset> {
	children: ReactNode
}

const RadioGroupRoot = ({
	layout = 'vertical',
	legend,
	isOptional,
	isRequired,
	children,
}: RadioGroupProps) => {
	return (
		<Fieldset
			layout={layout}
			legend={legend}
			isOptional={isOptional}
			isRequired={isRequired}
		>
			{children}
		</Fieldset>
	)
}

const RadioGroupField = (props: RadioFieldProps) => {
	return (
		<RadioField
			{...props}
			testingKey={props.testingKey}
			className={props.className}
		/>
	)
}

const RadioGroup = {
	Root: RadioGroupRoot,
	Field: RadioGroupField,
}

export { RadioGroup, RadioBase, RadioField }
