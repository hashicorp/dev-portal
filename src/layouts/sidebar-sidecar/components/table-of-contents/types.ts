export interface TableOfContentsHeading {
  title: string
  slug: string
  level: number
}

export interface TableOfContentsProps {
  headings: TableOfContentsHeading[]
}
