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
