/**
 * Truncates HCP operation paths for clarity.
 *
 * TODO: this is a shim for development.
 * We'll almost certainly want something like this, but will need
 * a clear solution to showing & allowing copy of the full path.
 */
export function truncateHcpOperationPath(path: string) {
	return path.replace(
		/(\/[a-z]*\/\d\d\d\d-\d\d-\d\d\/organizations\/\{[a-z_.]*\}\/projects\/\{[a-z_.]*\})/,
		''
	)
}
