import { PropsWithChildren } from 'react'

import filterSectionStyle from './filter-section.module.css'

export type FilterSectionProps = PropsWithChildren<{
	/**
	 * Label to be rendered above the section
	 */
	label: string
}>

export function FilterSection({ label, children }: FilterSectionProps) {
	return (
		<fieldset className={filterSectionStyle.root}>
			<legend className={filterSectionStyle.label}>{label}</legend>
			{children}
		</fieldset>
	)
}
