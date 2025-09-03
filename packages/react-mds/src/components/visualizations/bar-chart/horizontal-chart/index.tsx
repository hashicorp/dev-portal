'use client'

import React, { useMemo, useState } from 'react'
import classNames from 'classnames'
import Balancer from 'react-wrap-balancer'
import DatasetValue from './dataset-value'
import Legend from './legend'
import s from './style.module.css'
import { useMediaQuery } from '@web/hooks/use-media-query'
import { Button } from '../../../button'

interface Dataset {
	label: string
	values: Array<{
		value: number
		color: string
	}>
	total?: number
}

interface Category {
	label: string
	color: string
}

export interface HorizontalBarChartProps {
	/**
	 * Passing more than one category causes
	 * the Key to be displayed.
	 *
	 * If no categories are passed, the default
	 * color is Blue.
	 */
	categories?: Array<Category>
	/**
	 * All group.values.length must be equal
	 * to the length of the number of groups
	 * passed. If no groups are passed, each
	 * group.values.length must equal one.
	 */
	datasets: Array<Dataset>
	/**
	 * The total number of groups to display
	 * initially before the user hits the
	 * "Show all" button.  Default unlimited.
	 * */
	maxInitialDatasets?: number
	/**
	 * If true, values in each `group` will
	 * be stacked together to form a single
	 * bar.
	 */
	stacked?: boolean
}

export default function HorizontalBarChart({
	categories,
	datasets,
	// Default this to virtually unlimited
	maxInitialDatasets = 999,
	stacked = false,
}: HorizontalBarChartProps): JSX.Element {
	/**
	 * If screen width is higher than 560px,
	 * and this is a stacked bar chart,
	 * we can stack the bars
	 */
	const isStackable = useMediaQuery('(min-width: 560px)')
	const initialClipped = datasets.length > maxInitialDatasets
	/**
	 * If true, the chart only shows datasets
	 * up to `maxInitialDatasets`.
	 */
	const [isClipped, setIsClipped] = useState(initialClipped)

	const datasetsToDisplay = useMemo(() => {
		return isClipped ? datasets.slice(0, maxInitialDatasets) : datasets
	}, [isClipped, datasets, maxInitialDatasets])

	/**
	 * Calculate the largest value to calculate % widths
	 *
	 * We make this calculation on `datasets`, rather than
	 * `datasetsToDisplay` to prevent any resizing after
	 * 'Show All' is clicked
	 */
	const highestValue = useMemo(() => {
		let valueToReturn = 0
		datasets.forEach((dataset) => {
			if (stacked) {
				/**
				 * If we're using a stacked bar chart, we want to add
				 * up the dataset values to calculate our `valueToReturn`,
				 * as these will be presented together.
				 *
				 * The largest stack will be 100% width.
				 *
				 * P.S.: The `color` key in this variable's `.reduce()`
				 * calculation is just here for proper TS typing;
				 * `color` isn't otherwise used or necessary for
				 * `summedObj`.
				 */
				const valueSum = getDatasetTotal(dataset.values)

				/**
				 * If the bars are stackable (i.e. we're above 560px screen width)
				 * then we use the valueSum calculated above to determine the
				 * highestValue to return.
				 *
				 * Otherwise, we want the chart to behave like the unstacked
				 * bar chart, so we use the same logic unstacked charts do for
				 * determining highestValue.
				 */
				if (isStackable) {
					if (valueSum > valueToReturn) {
						valueToReturn = valueSum
					}
				} else {
					dataset.values.forEach(({ value }) => {
						if (value > valueToReturn) {
							valueToReturn = value
						}
					})
				}
			} else {
				/**
				 * In the event that we don't have a stacked bar chart,
				 * we simply want to find the highest value out of all
				 * of our values that is set (as that will be 100% width)
				 */
				dataset.values.forEach(({ value }) => {
					if (value > valueToReturn) {
						valueToReturn = value
					}
				})
			}
		})

		return valueToReturn
	}, [datasets, isStackable])

	return (
		<div className={s.barChart}>
			<div className={s.chart}>
				{datasetsToDisplay.map((dataset) => (
					<div className={s.dataset} key={dataset.label}>
						<div className={s.datasetLabel}>
							<Balancer>{dataset.label}</Balancer>
						</div>
						<div
							className={classNames(s.datasetValues, {
								[s.datasetValuesStacked]: stacked,
							})}
						>
							{dataset.values.map(({ value, color }, barIndex) => {
								return (
									<DatasetValue
										key={`dataset-${dataset.label}-${value}-${barIndex}`}
										value={value}
										highestValue={highestValue}
										color={color}
										stackable={stacked}
									/>
								)
							})}
							{stacked ? (
								<div>
									<p className={s.datasetTotal}>
										<span className={s.datasetTotalText}>Total:</span>
										<span className={s.datasetTotalPercent}>
											{dataset.total || getDatasetTotal(dataset.values)}%
										</span>
									</p>
								</div>
							) : null}
						</div>
					</div>
				))}
			</div>
			{initialClipped &&
				(isClipped ? (
					<Button
						className={s.showAllButton}
						title="Show all"
						theme={{
							brand: 'neutral',
							variant: 'secondary',
							background: 'light',
						}}
						onClick={() => setIsClipped(false)}
					/>
				) : (
					<Button
						className={s.showAllButton}
						title="Show less"
						theme={{
							brand: 'neutral',
							variant: 'secondary',
							background: 'light',
						}}
						onClick={() => setIsClipped(true)}
					/>
				))}
			{categories && categories.length > 1 && (
				<Legend className={s.legend} keys={categories} />
			)}
		</div>
	)
}

function getDatasetTotal(values: Dataset['values']): number {
	const totalObj = values.reduce(
		(a, b) => {
			return { value: a.value + b.value, color: '' }
		},
		{
			value: 0,
			color: '',
		}
	)

	return totalObj.value
}
