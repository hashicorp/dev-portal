/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * So far, we have a pattern of using a common value for
 * docs catchall route parameters: route/[[...page]].jsx.
 * This default parameter ID captures that pattern.
 * It can be overridden via options.
 */
export const DEFAULT_PARAM_ID = 'page'
export const REMARK_ARRAY_ERROR =
	'`remarkPlugins`: When specified as a function, must return an array of remark plugins'
