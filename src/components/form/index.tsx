/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Wrapper for the HTML <form> element. Currently adds no extra functionality.
 */
const Form = (props: JSX.IntrinsicElements['form']) => {
	const { children, ...restProps } = props
	return <form {...restProps}>{children}</form>
}

export default Form
