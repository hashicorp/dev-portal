export interface TableOfContentsHeading {
	title: string
	slug: string
	level: 1 | 2 | 3 | 4 | 5 | 6
	tabbedSectionDepth?: number
}

export interface TableOfContentsProps {
	headings: TableOfContentsHeading[]
}
