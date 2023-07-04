export function getPathItemObjects(schema: $TSFixMe): $TSFixMe[] {
	const pathItemObjects = Object.keys(schema.paths).reduce((acc, path) => {
		acc.push({ __path: path, ...schema.paths[path] })
		return acc
	}, [])
	return pathItemObjects
}
