import { HTMLProps, ReactNode, useId } from 'react'
import { Field } from '../field'
import s from './form-file-input.module.scss'

interface FileInputBaseProps {
	isRequired?: boolean
	className?: string
	id?: string

	/**
	 * Can be used to supply any props that the native `<input>` element supports.
	 * Since this is for file input, we omit `type`, see here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
	 */
	field: Omit<HTMLProps<HTMLInputElement>, 'type' | 'id'>
	error?: ReactNode
}

const FileInputBase = ({
	isRequired,
	className,
	id,
	field,
	error,
	...rest
}: FileInputBaseProps) => {
	const generatedId = useId()
	const inputId = id ?? generatedId

	return (
		<input
			type="file"
			required={isRequired}
			id={inputId}
			className={s['file-input']}
			aria-describedby={`${error ? 'error' : 'helper-text'}-${id}`}
			{...field}
			{...rest}
		/>
	)
}

interface FileInputFieldProps extends FileInputBaseProps {
	label?: ReactNode
	helperText?: ReactNode
	error?: ReactNode
	isOptional?: boolean
}

const FileInputField = ({
	id,
	label,
	helperText,
	error,
	field,
	className,
	isRequired,
	isOptional,
	...rest
}: FileInputFieldProps) => {
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
			<FileInputBase
				id={inputId}
				isRequired={isRequired}
				field={field}
				{...rest}
			/>
		</Field>
	)
}

export { FileInputBase, FileInputField }
