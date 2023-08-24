import { useId } from 'react'
import { Knob } from '../knobs-form'
import { getInitialValue } from '../knobs-form/get-initial-value'
import s from './array-input.module.css'

function ArrayInput({
	label,
	value,
	setValue,
	arrayOf,
	maxCount = -1,
	depth = 0,
}) {
	const id = useId()

	function setItemValue(idx, nv) {
		setValue(value.map((v, i) => (i === idx ? nv : v)))
	}

	function addItem() {
		const newArray = value.slice()
		newArray.push(getInitialValue(arrayOf))
		setValue(newArray)
	}

	function removeItem(idx) {
		setValue(value.filter((_v, i) => i !== idx))
	}

	function moveItem(idx, delta) {
		const newValue = value.slice()
		newValue[idx + delta] = value[idx]
		newValue[idx] = value[idx + delta]
		console.log(newValue)
		setValue(newValue)
	}

	return (
		<div className={s.root}>
			<label>{label}</label>
			<div className={s.items}>
				{value.map((item, idx) => {
					return (
						<ArrayInputItem
							// eslint-disable-next-line react/no-array-index-key
							key={id + idx}
							item={item}
							depth={depth}
							arrayOf={arrayOf}
							removeItem={removeItem}
							value={value}
							setValue={setItemValue}
							idx={idx}
							moveItem={moveItem}
						/>
					)
				})}
			</div>
			{maxCount <= 0 || value.length < maxCount ? (
				<button onClick={addItem}>+ Add {arrayOf.label}</button>
			) : null}
		</div>
	)
}

function ArrayInputItem({
	item,
	depth,
	arrayOf,
	removeItem,
	value,
	setValue,
	idx,
	moveItem,
}) {
	return (
		<div className={s.item}>
			<div className={s.sortButtons}>
				<button disabled={idx === 0} onClick={() => moveItem(idx, -1)}>
					&uarr;
				</button>
				<button
					disabled={idx + 2 > value.length}
					onClick={() => moveItem(idx, +1)}
				>
					&darr;
				</button>
			</div>
			<Knob
				value={item}
				setValue={(v) => setValue(idx, v)}
				depth={depth + 1}
				type={arrayOf.type}
				properties={arrayOf.properties}
			/>
			<button className={s.removeButton} onClick={() => removeItem(idx)}>
				&times;
			</button>
		</div>
	)
}

export default ArrayInput
