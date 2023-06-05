/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CollectionCardPropsWithId } from 'components/collection-card'
import { Collection as ClientCollection } from 'lib/learn-client/types'
import { CompanyLogoOption } from 'lib/learn-client/types'

export interface LogoCardListItem {
	logo: CompanyLogoOption
	collection: ClientCollection
}

export interface LogoCardListProps {
	collectionCards: CollectionCardPropsWithId[]
}
