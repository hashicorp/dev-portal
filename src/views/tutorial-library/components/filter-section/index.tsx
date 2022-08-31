import { PropsWithChildren } from 'react'

import filterSectionStyle from './filter-section.module.css'

export type FilterSectionProps = PropsWithChildren<{
	/**
	 * Heading to be rendered above the section
	 */
	heading: string
}>

export function FilterSection({ heading, children }: FilterSectionProps) {
	return (
		<fieldset className={filterSectionStyle.root}>
			<legend className={filterSectionStyle.heading}>{heading}</legend>
			<ul className={filterSectionStyle.filterList}>{children}</ul>
		</fieldset>
	)
}
