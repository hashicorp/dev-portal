type NativeInputProps = JSX.IntrinsicElements['input']

type InheritedInputProps = Pick<
	NativeInputProps,
	'aria-describedby' | 'checked' | 'className' | 'id' | 'name' | 'value'
>

interface CheckboxControlProps extends InheritedInputProps {
	id: NativeInputProps['id']
	onChange: NativeInputProps['onChange']
}

export type { CheckboxControlProps }
