import { CollectionCardPropsWithId } from 'components/collection-card'
import { CertificationsTextAndImageProps } from './components/certifications-text-and-image/types'
export interface CertificationsSectionProps
	extends CertificationsTextAndImageProps {
	collectionCards: CollectionCardPropsWithId[]
}
