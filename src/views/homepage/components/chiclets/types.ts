/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Property used to group HashiCorp products what the kind of solution offerred.
 */
type SolutionType =
	| 'application'
	| 'infrastructure'
	| 'networking'
	| 'notSpecified'
	| 'security'

export type { SolutionType }
