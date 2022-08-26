type NativeFieldSetProps = JSX.IntrinsicElements['fieldset']

type InheritedFieldSetProps = Pick<
	NativeFieldSetProps,
	'disabled' | 'form' | 'name'
>

interface RadioGroupOption {
	helperText?: string
	label: string
}

interface RadioGroupProps extends InheritedFieldSetProps {
	errors?: string[]
	helperText?: string
	isOptional?: boolean
	isRequired?: boolean
	layout?: 'vertical' | 'horizontal'
	legend?: string
	options: RadioGroupOption[]
}

export type { RadioGroupOption, RadioGroupProps }
