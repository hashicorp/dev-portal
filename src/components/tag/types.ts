/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

type NativeButtonProps = JSX.IntrinsicElements['button']

interface TagProps {
	onRemove?: NativeButtonProps['onClick']
	text: string
	removeButtonAriaLabel?: string
}

export type { TagProps }
