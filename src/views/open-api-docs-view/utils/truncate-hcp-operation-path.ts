/**
 * Truncates HCP operation paths for clarity.
 *
 * TODO: this is a shim for development.
 * We'll almost certainly want something like this, but needs may change.
 *
 * For now, we at least use it to help group operations by their path,
 * as grouping only really makes sense if we remove the extended prefix.
 */
export function truncateHcpOperationPath(path: string) {
	return path.replace(
		/(\/[a-z]*\/\d\d\d\d-\d\d-\d\d\/organizations\/\{[a-z_.]*\}\/projects\/\{[a-z_.]*\})/,
		''
	)
}
