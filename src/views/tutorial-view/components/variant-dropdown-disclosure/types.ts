import { ReactNode } from 'react'
import {
	TutorialVariant,
	TutorialVariantOption,
} from 'views/tutorial-view/utils/variants/types'

export interface VariantDropdownDisclosureProps {
	variant: TutorialVariant
	className?: string
}

export interface VariantDropdownDisclosureWithLabelProps {
	text: string
	children: ReactNode
}

export interface VariantDropdownDisclosureItemProps {
	variant: TutorialVariant
	activeOption: TutorialVariantOption
}
