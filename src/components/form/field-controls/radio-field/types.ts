import { ReactNode } from 'react'
import { LabelProps } from 'components/form/components'
import { RadioControlProps } from 'components/form/base-controls/radio-control'

type InheritedRadioControlProps = Pick<
	RadioControlProps,
	'checked' | 'name' | 'onChange' | 'onClick' | 'onKeyDown'
>

interface RadioFieldProps extends InheritedRadioControlProps {
	errors?: string[]
	helperText?: string
	id?: string
	initialIsChecked?: boolean
	label: ReactNode
	labelFontWeight?: LabelProps['fontWeight']
	value: string
}

export type { RadioFieldProps }
