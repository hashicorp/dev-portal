import { LabelProps } from 'components/form/components'

interface CheckboxFieldProps {
	errors?: string[]
	helperText?: string
	id?: string
	initialIsChecked?: boolean
	label: string
	labelFontWeight?: LabelProps['fontWeight']
	name?: string
}

export type { CheckboxFieldProps }
