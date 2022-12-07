import { ReactNode, useMemo, useState } from 'react'
import s from './css-custom-props-editor.module.css'

type CustomProps = Record<string, string | number>

const DEFAULT_VALUES: CustomProps = {
	'--test-width-px': 400,
	'--test-text-color': 'red',
}

export function CssCustomPropsEditor({ children }: { children: ReactNode }) {
	const [values, setValues] = useState<CustomProps>(DEFAULT_VALUES)

	// TODO: add JSON input / output

	function setValue(key, value) {
		setValues({ ...values, [key]: value })
	}

	const cssValues = useMemo(() => {
		return Object.keys(values).reduce((acc, key) => {
			const value = values[key]
			const maybeUnit = key.slice(-3)
			const finalValue = maybeUnit == '-px' ? `${value}px` : `${value}`
			acc[key] = finalValue
			return acc
		}, {})
	}, [values])

	return (
		<div style={cssValues}>
			<div className={s.root}>
				CSS Custom Props Editor
				{Object.keys(values).map((key) => {
					const value = values[key]
					const isNumber = typeof value === 'number'
					return (
						<div key={key}>
							<br />
							<label>{key}</label>
							<br />
							<input
								type={isNumber ? 'number' : 'text'}
								value={value}
								onChange={(e) => {
									const rawValue = e.target.value
									const parsedValue = isNumber ? parseFloat(rawValue) : rawValue
									setValue(key, parsedValue)
								}}
							></input>
						</div>
					)
				})}
			</div>
			{children}
		</div>
	)
}
