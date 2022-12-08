import { CustomProps } from './types'

const marginSettings: [string, string, number, number | null][] = [
	['p', 'Paragraph', 16, null],
	['h2', 'H2', 48, 12],
	['h3', 'H3', 32, 8],
	['h456', 'H4, H5, H6', 32, 8],
	['list-outer', 'Lists Outer', 24, null],
	['list-item', 'List Item', 16, null],
	['images', 'Image', 24, null],
	['table', 'Table', 24, null],
	['tabs', 'Tabs', 24, null],
	['blockquote', 'Blockquote', 32, null],
]

const MARGIN_VALUES: CustomProps = marginSettings.reduce(
	(acc, marginSetting) => {
		const [elem, name, top, bottom] = marginSetting
		const baseProp = `--dev-custom-${elem}-margin`
		if (typeof bottom === 'number') {
			// Separate top & bottom margin controls
			acc[`${baseProp}-top`] = {
				type: 'range',
				label: `${name} Top Margin`,
				value: top,
				min: 0,
				max: top * 2,
			}
			acc[`${baseProp}-bottom`] = {
				type: 'range',
				label: `${name} Bottom Margin`,
				value: bottom,
				min: 0,
				max: bottom * 2,
			}
		} else {
			// Single control for top & bottom margin
			acc[baseProp] = {
				type: 'range',
				label: `${name} Margin`,
				value: top,
				min: 0,
				max: top * 2,
			}
		}
		return acc
	},
	{}
)

export const DEFAULT_VALUES: CustomProps = {
	'--dev-content-max-width': {
		type: 'range',
		label: 'Content Max Width',
		min: 320,
		max: 1000,
		value: 680,
	},
	'--dev-custom-p-line-height': {
		label: 'Paragraph Line Height',
		type: 'range',
		unit: '',
		min: 0,
		max: 3,
		value: 1.6875,
		step: 0.05,
	},
	...MARGIN_VALUES,
	// '--test-text-color': {
	// 	type: 'text',
	// 	value: 'red',
	// },
}
