// Third-party imports
import { ReactElement, useMemo } from 'react'

// HashiCorp imports
import HashiHead from '@hashicorp/react-head'

// Global imports
import { useCurrentProduct } from 'contexts'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	generateInstallViewNavItems,
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'

// Local imports
import {
	ProductDownloadsViewContentProps,
	ProductDownloadsViewProps,
} from './types'
import {
	generateDefaultPackageManagers,
	generateEnterprisePackageManagers,
	generatePackageManagers,
	initializeBreadcrumbLinks,
	initializeVersionSwitcherOptions,
} from './helpers'
import { CurrentVersionProvider, useCurrentVersion } from './contexts'
import {
	DownloadsSection,
	FeaturedLearnCardsSection,
	OfficialReleasesSection,
	PageHeader,
	SidecarMarketingCard,
} from './components'

/**
 * This component is used to make it possible to consume the `useCurrentVersion`
 * hook in this view. `ProductDownloadsView` renders `CurrentVersionProvider`
 * and passes this component as the child.
 */
const ProductDownloadsViewContent = ({
	isEnterpriseMode = false,
	merchandisingSlot,
	pageContent,
	releases,
	versionSwitcherOptions,
}: ProductDownloadsViewContentProps) => {
	const {
		doesNotHavePackageManagers,
		featuredCollectionCards,
		featuredTutorialCards,
		packageManagerOverrides,
		sidecarMarketingCard,
		sidebarMenuItems,
		installName,
	} = pageContent
	const currentProduct = useCurrentProduct()
	const { currentVersion } = useCurrentVersion()
	const breadcrumbLinks = useMemo(
		() =>
			initializeBreadcrumbLinks(
				currentProduct,
				currentVersion,
				isEnterpriseMode
			),
		[currentProduct, currentVersion, isEnterpriseMode]
	)
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(currentProduct.name),
		generateProductLandingSidebarNavData(currentProduct),
		generateInstallViewNavItems(
			currentProduct,
			sidebarMenuItems,
			isEnterpriseMode
		),
	]
	const packageManagers = useMemo(() => {
		if (doesNotHavePackageManagers) {
			return []
		}

		return generatePackageManagers({
			defaultPackageManagers: isEnterpriseMode
				? generateEnterprisePackageManagers(currentProduct)
				: generateDefaultPackageManagers(currentProduct),
			packageManagerOverrides: packageManagerOverrides,
		})
	}, [
		currentProduct,
		doesNotHavePackageManagers,
		isEnterpriseMode,
		packageManagerOverrides,
	])

	return (
		<SidebarSidecarLayout
			/**
			 * @TODO remove casting to `any`. Will require refactoring both
			 * `generateTopLevelSidebarNavData` and
			 * `generateInstallViewNavItems` to set up `menuItems` with the
			 * correct types. This will require chaning many files, so deferring for
			 * a follow-up PR since this is functional for the time being.
			 */
			sidebarNavDataLevels={sidebarNavDataLevels as any}
			breadcrumbLinks={breadcrumbLinks}
			sidecarSlot={<SidecarMarketingCard {...sidecarMarketingCard} />}
		>
			{/**
			 * Legal has requested that we make the enterprise downloads page public
			 * but not search engine indexable
			 */}
			{isEnterpriseMode ? (
				<HashiHead>
					<meta name="robots" key="robots" content="noindex, nofollow" />
				</HashiHead>
			) : null}
			<PageHeader
				isEnterpriseMode={isEnterpriseMode}
				product={{
					name: installName || currentProduct.name,
					slug: currentProduct.slug,
				}}
			/>
			<DownloadsSection
				isEnterpriseMode={isEnterpriseMode}
				packageManagers={packageManagers}
				selectedRelease={releases.versions[currentVersion]}
				versionSwitcherOptions={versionSwitcherOptions}
			/>
			{merchandisingSlot}
			<OfficialReleasesSection />
			<FeaturedLearnCardsSection
				cards={featuredCollectionCards}
				cardType="collection"
			/>
			<FeaturedLearnCardsSection
				cards={featuredTutorialCards}
				cardType="tutorial"
			/>
		</SidebarSidecarLayout>
	)
}

/**
 * Handles rendering and initializing `CurrentVersionProvider`.
 */
const ProductDownloadsView = ({
	isEnterpriseMode = false,
	latestVersion,
	merchandisingSlot,
	pageContent,
	releases,
	sortedAndFilteredVersions,
}: ProductDownloadsViewProps): ReactElement => {
	const versionSwitcherOptions = useMemo(
		() =>
			initializeVersionSwitcherOptions({
				latestVersion,
				releaseVersions: sortedAndFilteredVersions,
			}),
		[latestVersion, sortedAndFilteredVersions]
	)

	return (
		<CurrentVersionProvider
			initialValue={versionSwitcherOptions[0].value}
			latestVersion={latestVersion}
		>
			<ProductDownloadsViewContent
				isEnterpriseMode={isEnterpriseMode}
				merchandisingSlot={merchandisingSlot}
				pageContent={pageContent}
				releases={releases}
				versionSwitcherOptions={versionSwitcherOptions}
			/>
		</CurrentVersionProvider>
	)
}

export default ProductDownloadsView
