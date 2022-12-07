import CodeBlock from '@hashicorp/react-code-block'
import { ReactNode, useMemo, useState } from 'react'
import { DEFAULT_VALUES } from './default-values'
import { CustomProps } from './types'
import s from './css-custom-props-editor.module.css'

export default function CssCustomPropsEditor({
	children,
}: {
	children: ReactNode
}) {
	const [customProps, setCustomProps] = useState<CustomProps>(DEFAULT_VALUES)

	function setCustomPropValue(key, value) {
		const baseProp = customProps[key]
		setCustomProps({ ...customProps, [key]: { ...baseProp, value } })
	}

	const cssValues = useMemo(() => {
		return Object.keys(customProps).reduce((acc, key) => {
			const customProp = customProps[key]
			let finalUnit: string = ''
			if ('unit' in customProp) {
				finalUnit = customProp.unit
			} else if (['range', 'number'].indexOf(customProp.type) !== -1) {
				finalUnit = 'px'
			}
			acc[key] = `${customProp.value}${finalUnit}`
			return acc
		}, {})
	}, [customProps])

	return (
		<div style={cssValues}>
			<div className={s.root}>
				CSS Custom Props Editor
				{Object.keys(customProps).map((key) => {
					const customProp = customProps[key]
					const { value, type } = customProp
					const label = customProp.label ?? key
					const setValue = (val: unknown) => setCustomPropValue(key, val)
					switch (type) {
						case 'range':
							return (
								<RangeInput
									key={key}
									label={label}
									value={value}
									min={customProp.min}
									max={customProp.max}
									step={customProp.step}
									setValue={setValue}
								/>
							)
						case 'number':
							return (
								<NumberInput
									key={key}
									label={label}
									value={value}
									step={customProp.step}
									setValue={setValue}
								/>
							)
						default:
							return (
								<TextInput
									key={key}
									label={label}
									value={value}
									setValue={setValue}
								/>
							)
					}
				})}
				<br />
				<br />
				<CodeBlock
					code={JSON.stringify(cssValues, null, 2)}
					options={{ showClipboard: true, heading: 'CSS Values' }}
				/>
			</div>
			{children}
		</div>
	)
}

function TextInput({ label, value, setValue }) {
	return (
		<div>
			<br />
			<label>{label}</label>
			<br />
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		</div>
	)
}

function NumberInput({ label, value, setValue, step }) {
	return (
		<div>
			<br />
			<label>{label}</label>
			<br />
			<input
				type="number"
				value={value}
				step={step}
				onChange={(e) => setValue(parseFloat(e.target.value))}
			/>
		</div>
	)
}

function RangeInput({ label, value, min, max, setValue, step }) {
	return (
		<div>
			<br />
			<label>{label}</label>
			<br />
			<input
				type="range"
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={(e) => setValue(parseFloat(e.target.value))}
			/>
			<span>{value}</span>
		</div>
	)
}
