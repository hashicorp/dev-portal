// Third-party imports
import { ReactElement, useMemo } from 'react'

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
	generatePackageManagers,
	initializeBreadcrumbLinks,
	initializeVersionSwitcherOptions,
} from './helpers'
import { CurrentVersionProvider, useCurrentVersion } from './contexts'
import {
	DownloadsSection,
	FeaturedTutorialsSection,
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
	merchandisingSlot,
	pageContent,
	releases,
	versionSwitcherOptions,
}: ProductDownloadsViewContentProps) => {
	const {
		doesNotHavePackageManagers,
		featuredLearnCards,
		packageManagerOverrides,
		sidecarMarketingCard,
		sidebarMenuItems,
	} = pageContent
	const currentProduct = useCurrentProduct()
	const { currentVersion } = useCurrentVersion()
	const breadcrumbLinks = useMemo(
		() => initializeBreadcrumbLinks(currentProduct, currentVersion),
		[currentProduct, currentVersion]
	)
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(currentProduct.name),
		generateProductLandingSidebarNavData(currentProduct),
		generateInstallViewNavItems(currentProduct, sidebarMenuItems),
	]
	const packageManagers = useMemo(() => {
		if (doesNotHavePackageManagers) {
			return []
		}

		return generatePackageManagers({
			defaultPackageManagers: generateDefaultPackageManagers(currentProduct),
			packageManagerOverrides: packageManagerOverrides,
		})
	}, [currentProduct, doesNotHavePackageManagers, packageManagerOverrides])

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
			<PageHeader />
			<DownloadsSection
				packageManagers={packageManagers}
				selectedRelease={releases.versions[currentVersion]}
				versionSwitcherOptions={versionSwitcherOptions}
			/>
			{merchandisingSlot}
			<OfficialReleasesSection />
			{featuredLearnCards?.length > 0 ? (
				<FeaturedTutorialsSection featuredLearnCards={featuredLearnCards} />
			) : null}
		</SidebarSidecarLayout>
	)
}

/**
 * Handles rendering and initializing `CurrentVersionProvider`.
 */
const ProductDownloadsView = ({
	latestVersion,
	merchandisingSlot,
	pageContent,
	releases,
}: ProductDownloadsViewProps): ReactElement => {
	const versionSwitcherOptions = useMemo(
		() => initializeVersionSwitcherOptions({ latestVersion, releases }),
		[latestVersion, releases]
	)

	return (
		<CurrentVersionProvider
			initialValue={versionSwitcherOptions[0].value}
			latestVersion={latestVersion}
		>
			<ProductDownloadsViewContent
				merchandisingSlot={merchandisingSlot}
				pageContent={pageContent}
				releases={releases}
				versionSwitcherOptions={versionSwitcherOptions}
			/>
		</CurrentVersionProvider>
	)
}

export default ProductDownloadsView
