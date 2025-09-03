'use client'

import { useState } from 'react'
import { ResponsivePie } from '@nivo/pie'
import { DonutChartData, DonutChartProps, DonutChartSize } from './types'
import useResizeObserver from 'use-resize-observer'
import classNames from 'classnames'
import { Tabs } from '../../tabs'
import {
	renderArcTooltip,
	useRenderArcLabelComponent,
	useRenderArcLinkLabelComponent,
} from './components'
import { useTabsContext } from '../../tabs/use-tabs-context'
import s from './styles.module.css'

const getArcLinkLabelsSkipAngle = (count: number): number => {
	if (count > 4) {
		return 24
	}

	return 16
}

const getMargins = (
	size: DonutChartSize
): {
	top?: number
	right?: number
	bottom?: number
	left?: number
} => {
	if (size === 'xsmall') {
		return { top: 10, right: 0, bottom: 10, left: 0 }
	} else if (size === 'small') {
		return { top: 10, right: 40, bottom: 20, left: 40 }
	} else {
		return { top: 80, right: 210, bottom: 84, left: 210 }
	}
}

export const DonutChart = ({ data }: DonutChartProps) =>
	data.length > 1 ? (
		<Tabs.Provider size="large">
			<Tabs.TabList>
				{data.map((group, i) => (
					<Tabs.Tab key={i} className={s.tab}>
						{group.groupName}
					</Tabs.Tab>
				))}
			</Tabs.TabList>
			<DonutChartPanelWithTabCtx data={data} />
		</Tabs.Provider>
	) : (
		<DonutChartPanel data={data} />
	)

const DonutChartPanelWithTabCtx = ({ data }: { data: DonutChartData[] }) => {
	const { selectedTabIndex, tabIds } = useTabsContext()

	const tabId = tabIds[selectedTabIndex]

	return (
		<DonutChartPanel tabId={tabId} data={data} groupIndex={selectedTabIndex} />
	)
}

export interface DonutChartPanelProps {
	tabId?: string
	data: DonutChartData[]
	groupIndex?: number
}

const DonutChartPanel = ({
	tabId,
	data,
	groupIndex = 0,
}: DonutChartPanelProps) => {
	const [size, setSize] = useState<DonutChartSize>('regular')
	const { ref } = useResizeObserver<HTMLDivElement>({
		onResize: ({ width }) => {
			if (width && width < 360) {
				setSize('xsmall')
			} else if (width && width < 600) {
				setSize('small')
			} else {
				setSize('regular')
			}
		},
	})

	return (
		<figure
			className={classNames(
				s['chart-container'],
				data.length > 1 && s.multiple
			)}
			id={data[groupIndex].groupId}
			role="tabpanel"
			tabIndex={0}
			aria-label={tabId ? undefined : data[groupIndex].groupName}
			aria-labelledby={tabId || undefined}
		>
			<div className={classNames(s.chart, s[size])} ref={ref}>
				<ResponsivePie
					data={data[groupIndex].groupData}
					margin={getMargins(size)}
					enableArcLabels={size !== 'regular'}
					enableArcLinkLabels={size === 'regular'}
					arcLabelsComponent={useRenderArcLabelComponent}
					arcLinkLabelComponent={useRenderArcLinkLabelComponent}
					arcLinkLabelsSkipAngle={getArcLinkLabelsSkipAngle(
						data[groupIndex].groupData.length
					)}
					tooltip={renderArcTooltip}
					aria-hidden="true"
					colors={{ datum: 'data.color' }}
					innerRadius={0.5}
					padAngle={1}
					cornerRadius={8}
					activeOuterRadiusOffset={4}
					arcLinkLabelsThickness={1}
					arcLinkLabelsOffset={4}
					arcLinkLabelsDiagonalLength={28}
					arcLinkLabelsStraightLength={24}
					arcLabelsSkipAngle={16}
				/>
				{data[groupIndex].groupCaption && (
					<figcaption>{data[groupIndex].groupCaption}</figcaption>
				)}
			</div>
			{size !== 'regular' && (
				<ul className={s.legend} aria-hidden="true">
					{data[groupIndex].groupData.map((record) => (
						<li key={record.id}>
							<span
								className={s['legend-dot']}
								style={{ background: record.color }}
							/>
							{record.label}
						</li>
					))}
				</ul>
			)}
		</figure>
	)
}
