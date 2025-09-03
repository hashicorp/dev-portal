export interface DonutChartSlice {
	id: string
	label: string
	value: number
	color: string
}

export type DonutChartData = {
	groupId: string
	groupName: string
	groupCaption?: string
	groupData: DonutChartSlice[]
}

export interface DonutChartProps {
	data: DonutChartData[]
}

export type DonutChartSize = 'regular' | 'small' | 'xsmall'
