/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

type NativeFieldSetProps = JSX.IntrinsicElements['fieldset']

type InheritedFieldSetProps = Pick<
	NativeFieldSetProps,
	'disabled' | 'form' | 'name'
>

interface CheckboxGroupOption {
	helperText?: string
	label: string
}

interface CheckboxGroupProps extends InheritedFieldSetProps {
	errors?: string[]
	helperText?: string
	isOptional?: boolean
	isRequired?: boolean
	layout?: 'vertical' | 'horizontal'
	legend?: string
	options: CheckboxGroupOption[]
}

export type { CheckboxGroupOption, CheckboxGroupProps }
