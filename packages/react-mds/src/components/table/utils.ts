export const DEFAULT_DENSITY = 'medium'
export const DENSITIES = ['default', 'medium', 'short', 'tall'] as const
export type Density = (typeof DENSITIES)[number]
export const getDensity = (densityStr: string): Density => {
	const density = densityStr as Density
	return DENSITIES.includes(density) ? density : DEFAULT_DENSITY
}

export const DEFAULT_VERTICAL_ALIGNMENT = 'top'
export const VERTICAL_ALIGNMENTS = ['baseline', 'middle', 'top'] as const
export type VerticalAlignment = (typeof VERTICAL_ALIGNMENTS)[number]
export const getVerticalAlignment = (valignStr: string): VerticalAlignment => {
	const valign = valignStr as VerticalAlignment
	return VERTICAL_ALIGNMENTS.includes(valign)
		? valign
		: DEFAULT_VERTICAL_ALIGNMENT
}

export const DEFAULT_ALIGNMENT = 'left'
export const ALIGNMENTS = ['left', 'center', 'right'] as const
export type HorizontalAlignment = (typeof ALIGNMENTS)[number]
export const getHorizontalAlignment = (
	alignStr: string
): HorizontalAlignment => {
	const align = alignStr as HorizontalAlignment
	return ALIGNMENTS.includes(align) ? align : DEFAULT_ALIGNMENT
}

export const DEFAULT_SCOPE = 'col'
export const SCOPES = ['col', 'row'] as const
export type Scope = (typeof SCOPES)[number]
export const getScope = (scopeStr: string): Scope => {
	const scope = scopeStr as Scope
	return SCOPES.includes(scope) ? scope : DEFAULT_SCOPE
}
