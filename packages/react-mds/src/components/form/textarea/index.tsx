import classNames from 'classnames'
import { useId } from 'react'
import { Field } from '../field'
import type { HTMLProps, ReactNode } from 'react'
import s from './form-textarea.module.css'

interface TextAreaBaseProps {
	isInvalid?: boolean
	isLoading?: boolean
	required?: boolean
	className?: string
	id: string
	field: HTMLProps<HTMLTextAreaElement>
	size: 'medium' | 'large'
	error?: ReactNode
	disabled?: boolean
}

const TextAreaBase = ({
	isInvalid,
	isLoading,
	className,
	id,
	field,
	size,
	error,
	...rest
}: TextAreaBaseProps) => {
	return (
		<textarea
			id={id}
			className={classNames(
				s.textarea,
				s[size],
				{
					[s.invalid]: isInvalid,
				},
				className
			)}
			aria-describedby={`${error ? 'error' : 'helper-text'}-${id}`}
			{...field}
			{...rest}
		/>
	)
}

interface TextAreaFieldProps {
	isInvalid?: boolean
	isLoading?: boolean
	isRequired?: boolean
	isOptional?: boolean
	id?: string
	label?: ReactNode
	helperText?: ReactNode
	error?: ReactNode
	field: HTMLProps<HTMLTextAreaElement>
	size?: 'medium' | 'large'
	disabled?: boolean
}

const TextAreaField = ({
	isInvalid,
	isLoading,
	isRequired,
	isOptional,
	id,
	label,
	helperText,
	error,
	field,
	size = 'medium',
	...rest
}: TextAreaFieldProps) => {
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
		>
			<TextAreaBase
				id={inputId}
				isInvalid={isInvalid}
				isLoading={isLoading}
				required={isRequired}
				field={field}
				size={size}
				{...rest}
			/>
		</Field>
	)
}

export { TextAreaField }
