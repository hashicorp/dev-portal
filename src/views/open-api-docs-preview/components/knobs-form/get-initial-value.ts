function getInitialValues(knobs) {
	return Object.keys(knobs).reduce((acc, knobId) => {
		const knob = knobs[knobId]
		acc[knobId] = getInitialValue(knob)
		return acc
	}, {})
}

function getInitialValue(knob) {
	if (typeof knob.initialValue !== 'undefined') {
		return knob.initialValue
	}
	let initialValue
	if (knob.type === 'object') {
		initialValue = getInitialValues(knob.properties)
	} else if (knob.type === 'array') {
		const count = knob.initialCount || 0
		initialValue = []
		for (let i = 0; i < count; i++) {
			initialValue.push(getInitialValue(knob.arrayOf))
		}
	} else {
		initialValue = getFallbackValue(knob)
	}
	return initialValue
}

function getFallbackValue(knob) {
	switch (knob.type) {
		case 'text':
			return 'Lorem ipsum text'
		default:
			return 'Default value'
	}
}

export { getInitialValue, getInitialValues }
