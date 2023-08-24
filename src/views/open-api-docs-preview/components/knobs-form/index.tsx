import { useId } from 'react'
import inputDict from './input-dictionary'

function Knob({ id, value, type, setValue, label }) {
	const InputComponent = inputDict[type]
	return (
		<InputComponent id={id} value={value} setValue={setValue} label={label} />
	)
}

function KnobsForm({ knobs, values, setValue }) {
	const formId = useId()
	return (
		<div>
			{Object.keys(knobs).map((knobKey: string) => {
				const { id, type, label } = knobs[knobKey]
				return (
					<Knob
						key={formId + knobKey}
						type={type}
						value={values[knobKey]}
						setValue={(v) => setValue(knobKey, v)}
						label={label || knobKey}
						id={id}
					/>
				)
			})}
		</div>
	)
}

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

export { Knob, getInitialValue, getInitialValues }
export default KnobsForm
