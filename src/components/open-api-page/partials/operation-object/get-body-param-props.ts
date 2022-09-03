function getBodyParamProps(bodyParam) {
	// We always expect the bodyParam to be an object,
	// with a schema which defines the body properties.
	if (!bodyParam.schema || !bodyParam.schema.properties) {
		return []
	}
	// We flatten these properties to avoid showing a
	// "collapsed object" UI under the "Body Parameters" section,
	// which would be a bit redundant and annoying to have to expand
	const bodyPropsObj = bodyParam.schema.properties
	const bodyProps = Object.keys(bodyPropsObj).reduce((acc, key) => {
		const data = Object.assign({}, bodyPropsObj[key])
		//  We need the property name. This is usually be handled by "key" in an object,
		// but we're flattening the object so we need to make sure it's there
		data.name = key
		if (!data.readOnly) {
			acc.push(data)
		}
		return acc
	}, [])
	return bodyProps
}

export default getBodyParamProps
