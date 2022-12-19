type NativeFieldSetProps = JSX.IntrinsicElements['fieldset']

type InheritedFieldSetProps = Pick<NativeFieldSetProps, 'disabled' | 'form'>

interface RadioGroupOption {
	helperText?: string
	label: string
	value: string
}

interface RadioGroupProps extends InheritedFieldSetProps {
	name: NativeFieldSetProps['name']
	errors?: string[]
	helperText?: string
	isOptional?: boolean
	isRequired?: boolean
	layout?: 'vertical' | 'horizontal'
	legend?: string
	onChange?: (value: string) => void
	options: RadioGroupOption[]
}

export type { RadioGroupOption, RadioGroupProps }
