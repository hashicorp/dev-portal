export interface TutorialVariant {
	id: string
	slug: string
	name: string
	activeOption: TutorialVariantOption
	options: TutorialVariantOption[]
}

export interface TutorialVariantOption {
	id: string
	name: string
	slug: string
}
