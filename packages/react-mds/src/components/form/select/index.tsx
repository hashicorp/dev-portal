import classNames from 'classnames'
import { HTMLProps, ReactNode, useId } from 'react'
import { Field } from '../field'
import s from './form-select.module.css'

interface SelectBaseProps {
	isInvalid?: boolean
	isLoading?: boolean
	required?: boolean
	className?: string
	id: string
	field: HTMLProps<HTMLSelectElement>
	children: ReactNode
	size: 'medium' | 'large'
	error?: ReactNode
	disabled?: boolean
}

const SelectBase = ({
	isInvalid,
	isLoading,
	className,
	id,
	field,
	children,
	size,
	error,
	...rest
}: SelectBaseProps) => {
	return (
		<select
			id={id}
			className={classNames(
				s.select,
				s[size],
				{
					[s.invalid]: isInvalid,
				},
				className
			)}
			aria-describedby={`${error ? 'error' : 'helper-text'}-${id}`}
			{...field}
			{...rest}
		>
			{children}
		</select>
	)
}

interface SelectFieldProps {
	isInvalid?: boolean
	isLoading?: boolean
	isRequired?: boolean
	isOptional?: boolean
	id?: string
	label?: ReactNode
	helperText?: ReactNode
	error?: ReactNode
	field: HTMLProps<HTMLSelectElement>
	children: ReactNode
	className?: string
	size?: 'medium' | 'large'
	disabled?: boolean
}

const SelectField = ({
	isInvalid,
	isLoading,
	isRequired,
	isOptional,
	id,
	label,
	helperText,
	error,
	field,
	children,
	className,
	size = 'medium',
	...rest
}: SelectFieldProps) => {
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
			layout="vertical"
			className={className}
		>
			<SelectBase
				id={inputId}
				isInvalid={isInvalid}
				required={isRequired}
				field={field}
				size={size}
				{...rest}
			>
				{children}
			</SelectBase>
		</Field>
	)
}

export { SelectField }
