import s from './style.module.css'
import Dialog from 'components/dialog'
import { FacetCheckbox } from './components/faceted-integrations-list'
import SearchableIntegrationsList from './components/searchable-integrations-list'
import {
	IntegrationsSearchProvider,
	useIntegrationsSearchContext,
} from './contexts/integrations-search-context'
import { ProductData } from 'types/products'
import { Integration, Tier } from 'lib/integrations-api-client/integration'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

interface ViewProps {
	product: ProductData
	integrations: Array<Integration>
}

import { IconAward16 } from '@hashicorp/flight-icons/svg-react/award-16'
import { IconHandshake16 } from '@hashicorp/flight-icons/svg-react/handshake-16'
import Button from '@hashicorp/react-button'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import {
	MobileDrawerContextProvider,
	useMobileDrawerContext,
} from './contexts/mobile-drawer-context'
import {
	generateTopLevelSidebarNavData,
	generateProductLandingSidebarNavData,
} from 'components/sidebar/helpers'
import { useCurrentProduct } from 'contexts'
import Sidebar, { type SidebarProps } from 'components/sidebar'
import SidebarBackToLink from 'components/sidebar/components/sidebar-back-to-link'
import { SidebarNavMenuItem } from 'components/sidebar/components'
import SidebarNavList from 'components/sidebar/components/sidebar-nav-list'

/**
 * A component that taps into the bulk of our search functionality.
 *
 * Gets reused by mobile and desktop views.
 */
const SearchFacets = () => {
	const {
		tierOptions,
		matchingOfficial,
		officialChecked,
		setOfficialChecked,
		matchingVerified,
		partnerChecked,
		setPartnerChecked,
		matchingCommunity,
		communityChecked,
		setCommunityChecked,
		sortedComponents,
		componentCheckedArray,
		setComponentCheckedArray,
		atLeastOneFacetSelected,
	} = useIntegrationsSearchContext()
	return (
		<>
			<div>
				<div>
					<h5>Tier</h5>
					{tierOptions.includes(Tier.OFFICIAL) && (
						<FacetCheckbox
							label="Official"
							icon={<IconAward16 className={s.awardIcon} />}
							matching={matchingOfficial}
							isChecked={officialChecked}
							onChange={(e) => setOfficialChecked(!officialChecked)}
						/>
					)}
					{tierOptions.includes(Tier.PARTNER) && (
						<FacetCheckbox
							label="Partner"
							icon={<IconHandshake16 className={s.checkIcon} />}
							matching={matchingVerified}
							isChecked={partnerChecked}
							onChange={(e) => setPartnerChecked(!partnerChecked)}
						/>
					)}
					{tierOptions.includes(Tier.COMMUNITY) && (
						<FacetCheckbox
							label="Community"
							matching={matchingCommunity}
							isChecked={communityChecked}
							onChange={(e) => setCommunityChecked(!communityChecked)}
						/>
					)}

					<h5>Component</h5>
					{sortedComponents.map((component, index) => {
						return (
							<FacetCheckbox
								key={component.id}
								label={component.plural_name}
								matching={component.occurances}
								isChecked={componentCheckedArray[index]}
								onChange={(e) =>
									setComponentCheckedArray(
										componentCheckedArray.map((v, i) => {
											return i === index ? !v : v
										})
									)
								}
							/>
						)
					})}

					{atLeastOneFacetSelected && (
						<Button
							title="Reset filters"
							size="small"
							onClick={(e) => {
								setOfficialChecked(false)
								setPartnerChecked(false)
								setCommunityChecked(false)
								setComponentCheckedArray(
									componentCheckedArray.map((v, i) => {
										return false
									})
								)
							}}
						/>
					)}
				</div>
			</div>
		</>
	)
}

// Custom sidebar
const IntegrationsSearchSidebar = (props: SidebarProps) => {
	const product = useCurrentProduct()
	return (
		<>
			{/* Desktop sidebar — render search facets */}
			<div className="g-hide-with-mobile-menu">
				<SidebarNavList>
					<SidebarBackToLink
						text={`${product.name} Home`}
						href={`/${product.slug}`}
					/>
					<SidebarNavMenuItem item={{ divider: true }} />
				</SidebarNavList>

				<SearchFacets />
			</div>
			{/* Mobile sidebar - render sidebar */}
			<div className="g-show-with-mobile-menu">
				<Sidebar {...props} />
			</div>
		</>
	)
}

const IntegrationsSearchDrawer = () => {
	const { dialogOpen, setDialogOpen } = useMobileDrawerContext()
	return (
		<Dialog
			isOpen={dialogOpen}
			label="Integrations filters"
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onDismiss={() => {}}
			variant="bottom"
		>
			<button
				className={s.exitIcon}
				onClick={() => setDialogOpen(false)}
				aria-label="Cancel"
				type="button"
			>
				<IconX16 />
			</button>
			<SearchFacets />
		</Dialog>
	)
}

export default function ProductIntegrationsLanding({
	product,
	integrations,
}: ViewProps) {
	const breadcrumbLinks = [
		{
			title: 'Developer',
			url: '/',
			isCurrentPage: false,
		},
		{
			title: product.name,
			url: `/${product.slug}`,
			isCurrentPage: false,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
			isCurrentPage: true,
		},
	]
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(product.name),
		generateProductLandingSidebarNavData(product),
		{
			backToLinkProps: {
				text: `${product.name} Home`,
				href: `/${product.slug}`,
			},
			levelButtonProps: {
				levelUpButtonText: `${product.name} Home`,
				levelDownButtonText: 'Previous',
			},
			menuItems: [],
			showFilterInput: false,
			title: `${product.name} Integrations`,
		},
	]
	return (
		<IntegrationsSearchProvider integrations={integrations}>
			<MobileDrawerContextProvider>
				<SidebarSidecarLayout
					sidebarNavDataLevels={sidebarNavDataLevels}
					breadcrumbLinks={breadcrumbLinks}
					sidecarSlot={<></>}
					AlternateSidebar={IntegrationsSearchSidebar}
				>
					<div className={s.mainArea}>
						<SearchableIntegrationsList className={s.searchList} />
					</div>
				</SidebarSidecarLayout>
				<IntegrationsSearchDrawer />
			</MobileDrawerContextProvider>
		</IntegrationsSearchProvider>
	)
}
