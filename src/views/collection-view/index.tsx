import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { useOptInAnalyticsTracking } from 'hooks/use-opt-in-analytics-tracking'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
	CollectionViewSidebarContent,
} from 'components/tutorials-sidebar'
import OptInOut from 'components/opt-in-out'
import { getTutorialSlug } from './helpers'
import { CollectionPageProps } from './server'
import CollectionMeta from './components/collection-meta'
import CollectionTutorialList from './components/collection-tutorial-list'
import { formatTutorialCard } from 'components/tutorial-card/helpers'

function CollectionView({
	collection,
	layoutProps,
	product,
}: CollectionPageProps): React.ReactElement {
	useOptInAnalyticsTracking('learn')
	const { name, slug, description, tutorials, ordered } = collection

	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		{
			levelButtonProps: {
				levelUpButtonText: `${product.name} Home`,
				levelDownButtonText: 'Previous',
			},
			backToLinkProps: {
				text: `${product.name} Home`,
				href: `/${product.slug}`,
			},
			title: 'Tutorials',
			overviewItemHref: `/${product.slug}/tutorials`,
			children: (
				<CollectionViewSidebarContent sections={layoutProps.sidebarSections} />
			),
		},
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
			optInOutSlot={<OptInOut platform="learn" />}
			sidecarSlot={null}
		>
			<CollectionMeta
				// Note: id is passed here because it is required by <Heading />,
				// it's not used for #anchor linking since there is no sidecar.
				heading={{ text: name, id: collection.id }}
				description={description}
				cta={{ href: getTutorialSlug(tutorials[0].slug, slug) }}
				numTutorials={tutorials.length}
			/>
			<CollectionTutorialList
				isOrdered={ordered}
				tutorials={tutorials.map((t: ClientTutorialLite) =>
					formatTutorialCard(t, slug)
				)}
			/>
		</SidebarSidecarLayout>
	)
}

CollectionView.contentType = 'tutorials'

export default CollectionView
