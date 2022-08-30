import { ReactNode } from 'react'
import { LabelProps } from 'components/form/components'

interface CheckboxFieldProps {
	errors?: string[]
	helperText?: string
	id?: string
	initialIsChecked?: boolean
	label: ReactNode
	labelFontWeight?: LabelProps['fontWeight']
	name?: string
}

export type { CheckboxFieldProps }
