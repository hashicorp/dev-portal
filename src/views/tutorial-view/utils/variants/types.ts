import {
	TutorialVariant as ClientTutorialVariant,
	TutorialVariantOption as ClientTutorialVariantOption,
} from 'lib/learn-client/types'


export interface TutorialVariant extends ClientTutorialVariant {
	activeOption: TutorialVariantOption
}

export type TutorialVariantOption = ClientTutorialVariantOption
