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
		<section className={filterSectionStyle.root}>
			<span className={filterSectionStyle.heading}>{heading}</span>
			<ul className={filterSectionStyle.filterList}>{children}</ul>
		</section>
	)
}
