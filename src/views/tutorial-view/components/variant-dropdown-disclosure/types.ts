import { TutorialVariant } from 'views/tutorial-view/utils/variants/types'

export interface VariantDropdownDisclosureProps {
	variant: TutorialVariant
	classNames?: {
		dropdownRoot: string
		dropdownActivator: string
	}
	isFullWidth?: boolean
}
