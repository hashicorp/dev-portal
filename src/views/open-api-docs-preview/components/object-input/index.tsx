import KnobsForm from '../knobs-form'
import s from './object-input.module.css'

export function ObjectInput({ label, value, setValue, properties }) {
	return (
		<div className={s.root}>
			<label>{label}</label>
			<KnobsForm
				knobs={properties}
				values={value}
				setValue={(k, v) => {
					const newObjectValue = Object.assign({}, value, { [k]: v })
					setValue(newObjectValue)
				}}
			/>
		</div>
	)
}
