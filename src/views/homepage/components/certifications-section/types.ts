/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CollectionCardPropsWithId } from 'components/collection-card'
import { CertificationsTextAndImageProps } from './components/certifications-text-and-image/types'
export interface CertificationsSectionProps
	extends CertificationsTextAndImageProps {
	collectionCards: CollectionCardPropsWithId[]
}
