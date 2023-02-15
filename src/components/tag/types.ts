/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

type NativeButtonProps = JSX.IntrinsicElements['button']

interface TagProps {
	onRemove?: NativeButtonProps['onClick']
	text: string
	removeButtonAriaLabel?: string
}

export type { TagProps }
