export interface TutorialVariant {
	id: string
	slug: string
	name: string
	options: TutorialVariantOption[]
}

export interface TutorialVariantOption {
	id: string
	name: string
	slug: string
}
