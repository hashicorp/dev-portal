import { useState } from 'react'
import classNames from 'classnames'
import useResizeObserver from 'use-resize-observer'
import s from './style.module.css'
import { getContrastYIQ, hexToRgb } from '../../../../../utils/get-contrast-yiq'

interface DatasetValueProps {
	value: number
	highestValue: number
	color: string
	stackable: boolean
}

export default function DatasetValue({
	value,
	highestValue,
	color,
	stackable,
}: DatasetValueProps) {
	const [valueIsOffset, setValueIsOffset] = useState(false)
	const { ref } = useResizeObserver<HTMLDivElement>({
		onResize: ({ width }) => {
			// If the value is 0, we want to show a 0.5% bar
			if (value === 0) {
				value = 0.5
			}

			/**
			 * The logic below determines the threshold (in `px`)
			 * a bar's width needs to reach for the value to be offset
			 * by moving it to the right of the bar.
			 *
			 * The default below is for single-digit values.
			 */
			let offsetThreshold = 32

			if (value >= 10 && value <= 99) {
				// Offset threshold for 2 digit values
				offsetThreshold = 40
			} else if (value >= 100) {
				// Offset threshold for 3+ digit values
				offsetThreshold = 48
			}

			if (width && width < offsetThreshold) {
				setValueIsOffset(true)
			} else {
				setValueIsOffset(false)
			}
		},
	})

	const valueColor = getContrastYIQ(hexToRgb(color))

	/**
	 * The actual width of the bar, however, should be
	 * a percentage of the highest value in the chart
	 */
	const percentageOfHighest = (value / highestValue) * 100

	return (
		<div
			ref={ref}
			className={classNames(s.datasetValue, s[valueColor])}
			style={
				{
					'--width': percentageOfHighest,
				} as React.CSSProperties
			}
		>
			<div
				className={s.datasetValueBar}
				style={
					{
						'--bar-background': color,
					} as React.CSSProperties
				}
			/>
			<span
				className={classNames(s.datasetValuePercent, {
					[s.offset]: valueIsOffset,
					[s.stackable]: stackable,
				})}
			>
				{value}%
			</span>
		</div>
	)
}
