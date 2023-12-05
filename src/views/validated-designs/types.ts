import { ProductSlug } from 'types/products'

export interface HvdCategoryGroup {
	slug: string // start of slug e.g. terraform-operation-guides, used to add to the guides
	title: string // from YAML
	description: string // from YAML
	product: ProductSlug
	guides: HvdGuide[]
}

export interface HvdGuide {
	slug: string // base slug e.g. terraform-operation-guide-adoption
	title: string // from YAML
	description: string // from YAML
	href: string // e.g. /validated-designs/terraform-operation-guides-adoption
	pages: HvdPage[]
}

export interface HvdPage {
	slug: string // e.g. people-and-process
	title: string // e.g. people and process
	href: string // e.g. /validated-designs/terraform-operation-guides-adoption/people-and-process
	filePath: string // full path to the file e.g. /content/validated-designs/operation-guides/terraform-operation-guides-adoption/0000-introduction.mdx
}
