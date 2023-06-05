import { useState } from 'react'

function DevHeightAdjustablePlaceholder({
	name,
	defaultCssHeight = '123px',
}: {
	name: string
	defaultCssHeight?: string
}) {
	const [defaultValue, defaultUnit] = badlyParseCssValueUnit(defaultCssHeight)
	const [heightValue, setHeightValue] = useState<number>(defaultValue)
	const [heightUnit, setHeightUnit] = useState<string>(defaultUnit)

	return (
		<div
			style={{
				height: `${heightValue}${heightUnit}`,
				border: '1px solid magenta',
				overflow: 'hidden',
			}}
		>
			{name}
			<div style={{ display: 'flex' }}>
				<input
					style={{ display: 'block' }}
					type="range"
					min="10"
					max="300"
					id={'top-content-value-slider'}
					value={heightValue}
					onChange={(e) => setHeightValue(parseInt(e.target.value))}
				></input>
				<span>{heightValue}</span>
				<input
					style={{ width: 0, flexGrow: 1 }}
					type="text"
					id="top-content-unit-input"
					value={heightUnit}
					onChange={(e) => setHeightUnit(e.target.value)}
				></input>
			</div>
		</div>
	)
}

/**
 * Note: this really only works in very specific cases:
 * - value must be an integer
 * - unit must be a-z characters only
 * - string must not have any other characters.
 */
function badlyParseCssValueUnit(cssValueString: string): [number, string] {
	const unit = cssValueString.replace(/\d/g, '')
	const value = parseInt(cssValueString.replace(unit, ''))
	return [value, unit]
}

export default DevHeightAdjustablePlaceholder
