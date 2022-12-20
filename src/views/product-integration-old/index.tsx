import HashiHead from '@hashicorp/react-head'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import Tabs, { Tab } from 'components/tabs'
import { useCurrentProduct } from 'contexts'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release, ReleaseComponent } from 'lib/integrations-api-client/release'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import { ProductData } from 'types/products'
import ComponentTabContent from './components/component-tab-content'
import Header from './components/header'
import s from './style.module.css'

interface ViewProps {
	integration: Integration & { readmeMdxSource: MDXRemoteSerializeResult }
	versions: {
		value: string
		label: string
		href: string
	}[]
	product: ProductData
	activeRelease: Release
	breadcrumbLinks: BreadcrumbLink[]
}

export default function ProductIntegration({
	integration,
	versions,
	activeRelease,
	breadcrumbLinks,
}: ViewProps) {
	// use `notLatest` to conditionally render a noindex meta tag
	const notLatest = activeRelease.version !== integration.versions[0]

	// update query params based on tab selection
	const router = useRouter()
	const tab = router.query.tab as string

	// two maps to help us convert between tab index and slug
	const map = useMemo(
		() =>
			activeRelease.components.reduce(
				(acc, rc, index) => {
					acc.slugToIndex[rc.component.slug] = index + 1
					acc.indexToSlug[index + 1] = rc.component.slug
					return acc
				},
				{
					slugToIndex: {},
					indexToSlug: {},
				} as {
					slugToIndex: Record<string, number>
					indexToSlug: Record<number, string>
				}
			),
		[activeRelease.components]
	)

	// translate index to slug
	const handleTabChange = (newIndex: number) => {
		if (newIndex === 0) {
			delete router.query.tab
			router.replace({ query: router.query })
			return
		}
		router.replace({
			query: { ...router.query, tab: map.indexToSlug[newIndex] },
		})
	}

	// Generate Sidebar Information
	const currentProduct = useCurrentProduct()
	const sidebarNavDataLevels = [
		generateTopLevelSidebarNavData(currentProduct.name),
		generateProductLandingSidebarNavData(currentProduct),
		// TODO: Generate the Integrations Landing Page Level
		{
			backToLinkProps: {
				text: `${currentProduct.name} Integrations Home`,
				href: `/${currentProduct.slug}/integrations`,
			},
			levelButtonProps: {
				levelUpButtonText: `${currentProduct.name} Home`,
				levelDownButtonText: 'Previous',
			},
			menuItems: [],
			showFilterInput: false,
			title: integration.name,
		},
	]

	const readmeContent = (
		<MDXRemote
			{...integration.readmeMdxSource}
			components={defaultMdxComponents({})}
		/>
	)

	return (
		<SidebarSidecarLayout
			sidebarNavDataLevels={sidebarNavDataLevels}
			breadcrumbLinks={breadcrumbLinks}
			sidecarSlot={<></>}
		>
			<>
				{notLatest && (
					<HashiHead>
						<meta name="robots" content="noindex, nofollow" />
					</HashiHead>
				)}
				<div className={s.content}>
					<Header
						className={s.header}
						integration={integration}
						activeRelease={activeRelease}
						versions={versions}
						onInstallClicked={() => {
							// TODO: we'll need to flip the tab over to the install tab here
							console.log('TODO: Install Clicked')
						}}
					/>
					<Tabs
						allowNestedStyles
						// translate slug to index
						initialActiveIndex={map.slugToIndex[tab]}
						onChange={handleTabChange}
					>
						<Tab heading="README">{readmeContent}</Tab>
						{activeRelease.components.map(
							(
								irc: ReleaseComponent & {
									readmeMdxSource: MDXRemoteSerializeResult
								}
							) => {
								return irc.readme || irc.variable_groups.length ? (
									<Tab key={irc.component.id} heading={irc.component.name}>
										<ComponentTabContent component={irc} />
									</Tab>
								) : (
									<></>
								)
							}
						)}
					</Tabs>
				</div>
			</>
		</SidebarSidecarLayout>
	)
}
