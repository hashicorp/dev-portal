import { ReactNode } from 'react'
import { LabelProps } from 'components/form/components'
import { CheckboxControlProps } from 'components/form/base-controls'

type InheritedCheckboxControlProps = Pick<
	CheckboxControlProps,
	'checked' | 'name' | 'onChange' | 'onClick'
>

interface CheckboxFieldProps extends InheritedCheckboxControlProps {
	errors?: string[]
	helperText?: string
	id?: CheckboxControlProps['id']
	label: ReactNode
	labelFontWeight?: LabelProps['fontWeight']
}

export type { CheckboxFieldProps }
