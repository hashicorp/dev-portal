import { ReactNode } from 'react'
import { LabelProps } from 'components/form/components'

import { CheckboxControlProps } from 'components/form/base-controls'

type InheritedCheckboxControlProps = Pick<
	CheckboxControlProps,
	'checked' | 'name' | 'onChange' | 'onClick' | 'id'
>

interface CheckboxFieldProps extends InheritedCheckboxControlProps {
	errors?: string[]
	helperText?: string
	label: ReactNode
	labelFontWeight?: LabelProps['fontWeight']
	name?: string
}

export type { CheckboxFieldProps }
