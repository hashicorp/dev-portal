/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar from 'components/tutorials-sidebar'
import { CollectionPageProps } from './server'
import CollectionMeta from './components/collection-meta'
import CollectionTutorialList from './components/collection-tutorial-list'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import { generateCollectionSidebarNavData } from './helpers/generate-collection-sidebar-nav-data'
import { SignupFormArea } from 'views/certifications/components'
import s from './style.module.css'

function CollectionView({
	collection,
	layoutProps,
	product,
}: CollectionPageProps): React.ReactElement {
	const { name, description, tutorials, ordered } = collection

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		generateCollectionSidebarNavData(product, layoutProps.sidebarSections),
	]

	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			AlternateSidebar={TutorialsSidebar}
			/**
			 * @TODO remove casting to `any`. Will require refactoring both
			 * `generateTopLevelSidebarNavData` and
			 * `generateProductLandingSidebarNavData` to set up `menuItems` with the
			 * correct types. This will require chaning many files, so deferring for
			 * a follow-up PR since this is functional for the time being.
			 */
			sidebarNavDataLevels={sidebarNavDataLevels as any}
		>
			<CollectionMeta
				collection={collection}
				// Note: id is passed here because it is required by <Heading />,
				// it's not used for #anchor linking since there is no sidecar.
				heading={{ text: name, id: collection.id }}
				description={description}
			/>
			<CollectionTutorialList
				isOrdered={ordered}
				tutorials={tutorials.map((t: ClientTutorialLite) =>
					formatTutorialCard(t, collection)
				)}
			/>
			{layoutProps.isCertificationPrep && (
				<SignupFormArea className={s.newsletterSignupArea} />
			)}
		</SidebarSidecarLayout>
	)
}

export default CollectionView
