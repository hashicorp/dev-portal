'use client'

import HorizontalBarChart, {
	type HorizontalBarChartProps,
} from './horizontal-chart'
import { useTabsContext } from '../../tabs/use-tabs-context'
import { Tabs } from '../../tabs'
import classNames from 'classnames'
import s from './style.module.css'

interface HorizontalBarChart extends HorizontalBarChartProps {
	name: string
	caption: string
}

export interface BarChartProps {
	data: HorizontalBarChart[]
}

export const BarChart = ({ data }: BarChartProps) => {
	return (
		<div className={s.root}>
			{data.length > 1 ? (
				<Tabs.Provider size="large">
					<Tabs.TabList>
						{data.map((chart, i) => (
							<Tabs.Tab key={i} className={s.tab}>
								{chart.name}
							</Tabs.Tab>
						))}
					</Tabs.TabList>
					<BarChartPanelWithTabCtx data={data} />
				</Tabs.Provider>
			) : (
				<BarChartPanel data={data} />
			)}
		</div>
	)
}

const BarChartPanelWithTabCtx = ({ data }: { data: BarChartProps['data'] }) => {
	const { selectedTabIndex, tabIds } = useTabsContext()

	const tabId = tabIds[selectedTabIndex]

	return (
		<BarChartPanel tabId={tabId} data={data} chartIndex={selectedTabIndex} />
	)
}

interface BarChartPanelProps {
	tabId?: string
	data: BarChartProps['data']
	chartIndex?: number
}

const BarChartPanel = ({ tabId, data, chartIndex = 0 }: BarChartPanelProps) => {
	const chartName = data[chartIndex].name

	return (
		<figure
			className={classNames(s.chartContainer, data.length > 1 && s.multiple)}
			id={chartName.toLowerCase()}
			role="tabpanel"
			tabIndex={0}
			aria-label={tabId ? undefined : chartName}
			aria-labelledby={tabId || undefined}
		>
			<HorizontalBarChart {...data[chartIndex]} />
			<div className={s.chart}>
				{data[chartIndex].caption && (
					<figcaption className={s.caption}>
						{data[chartIndex].caption}
					</figcaption>
				)}
			</div>
		</figure>
	)
}
