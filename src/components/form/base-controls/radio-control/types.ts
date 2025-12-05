/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

type NativeInputProps = JSX.IntrinsicElements['input']

type InheritedInputProps = Pick<
	NativeInputProps,
	| 'aria-describedby'
	| 'checked'
	| 'className'
	| 'name'
	| 'onChange'
	| 'onClick'
	| 'onKeyDown'
	| 'value'
>

interface RadioControlProps extends InheritedInputProps {
	id: NativeInputProps['id']
}

export type { RadioControlProps }
