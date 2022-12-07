interface BaseInput {
	label?: string
}

export type CustomPropInput = BaseInput &
	(
		| {
				type: 'range'
				value: number
				min: number
				max: number
				unit?: string
				step?: number
		  }
		| {
				type: 'number'
				value: number
				unit?: string
				step?: number
		  }
		| {
				type: 'text'
				value: string
		  }
	)

export type CustomProps = Record<string, CustomPropInput>
