import { useId } from 'react'
import inputDict from './input-dictionary'

function Knob({ value, type, setValue, label, properties }: $TSFixMe) {
	const id = useId()
	const InputComponent = inputDict[type]
	return (
		<InputComponent
			id={id}
			value={value}
			setValue={setValue}
			label={label}
			properties={properties}
		/>
	)
}

function KnobsForm({ knobs, values, setValue }) {
	const formId = useId()
	return (
		<div>
			{Object.keys(knobs).map((knobKey: string) => {
				const { type, label } = knobs[knobKey]
				return (
					<Knob
						key={formId + knobKey}
						type={type}
						value={values[knobKey]}
						setValue={(v) => setValue(knobKey, v)}
						label={label || knobKey}
					/>
				)
			})}
		</div>
	)
}

export { Knob }
export default KnobsForm
