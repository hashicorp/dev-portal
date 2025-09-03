import {
	useId,
	type ComponentProps,
	type HTMLProps,
	type ReactNode,
} from 'react'
import { Field } from '../field'
import { Fieldset } from '../fieldset'
import s from './form-checkbox.module.css'

interface CheckboxBaseProps {
	id?: string
	required?: boolean
	field: HTMLProps<HTMLInputElement>
	testingKey?: string
	error?: ReactNode
}

const CheckboxBase = ({
	id,
	required,
	field,
	testingKey,
	error,
}: CheckboxBaseProps) => {
	const generatedId = useId()
	const inputId = id ?? generatedId

	return (
		<input
			id={inputId}
			type="checkbox"
			className={s.checkbox}
			required={required}
			aria-describedby={`${error ? 'error' : 'helper-text'}-${id}`}
			data-testid={testingKey}
			{...field}
		/>
	)
}

interface CheckboxFieldProps {
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
	disabled?: boolean
}

const CheckboxField = ({
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
}: CheckboxFieldProps) => {
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
			<CheckboxBase
				id={inputId}
				required={isRequired}
				field={field}
				testingKey={testingKey}
				error={error}
				{...rest}
			/>
		</Field>
	)
}

interface CheckboxGroupRootProps extends ComponentProps<typeof Fieldset> {
	children: ReactNode
}

const CheckboxGroupRoot = ({
	layout = 'vertical',
	legend,
	helperText,
	error,
	isOptional,
	isRequired,
	children,
}: CheckboxGroupRootProps) => {
	return (
		<Fieldset
			layout={layout}
			legend={legend}
			helperText={helperText}
			error={error}
			isOptional={isOptional}
			isRequired={isRequired}
		>
			{children}
		</Fieldset>
	)
}

const CheckboxGroupInner = (props: CheckboxFieldProps) => {
	return (
		<CheckboxField
			className={props.className}
			testingKey={props.testingKey}
			{...props}
		/>
	)
}

const CheckboxGroup = {
	Root: CheckboxGroupRoot,
	Inner: CheckboxGroupInner,
}

export { CheckboxGroup, CheckboxBase, CheckboxField }
