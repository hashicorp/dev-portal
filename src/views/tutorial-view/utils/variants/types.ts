import {
	TutorialVariant as ClientTutorialVariant,
	TutorialVariantOption as ClientTutorialVariantOption,
} from 'lib/learn-client/types'

// @TODO rename to TutorialViewVariant? Wait until rebase to avoid conflicts

export interface TutorialVariant extends ClientTutorialVariant {
	activeOption: TutorialVariantOption
}

export type TutorialVariantOption = ClientTutorialVariantOption
