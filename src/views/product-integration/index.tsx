import { useMemo } from 'react'
import { useRouter } from 'next/router'
import HashiHead from '@hashicorp/react-head'
import BreadcrumbBar, { BreadcrumbLink } from 'components/breadcrumb-bar'
import Tabs, { Tab } from 'components/tabs'
import BaseLayout from 'layouts/base-new'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release, ReleaseComponent } from 'lib/integrations-api-client/release'
import ReactMarkdown from 'react-markdown'
import { ProductData } from 'types/products'
import ComponentTabContent from './components/component-tab-content'
import Header from './components/header'
import s from './style.module.css'

interface ViewProps {
	integration: Integration
	versions: {
		value: string
		label: string
		href: string
	}[]
	product: ProductData
	activeRelease: Release
	breadcrumbLinks: BreadcrumbLink[]
}

export default function ProductIntegrationLanding({
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

	return (
		<BaseLayout showFooterTopBorder>
			{notLatest && (
				<HashiHead>
					<meta name="robots" content="noindex, nofollow" />
				</HashiHead>
			)}
			<div className={s.integrationPage}>
				<div className={s.sidebar}></div>
				<div className={s.mainArea}>
					<div className={s.contentWrapper}>
						<div className={s.breadcrumbWrapper}>
							<BreadcrumbBar links={breadcrumbLinks} />
						</div>
						<div className={s.content}>
							<Header
								className={s.header}
								name={integration.name}
								tier={integration.tier}
								author={integration.organization.slug}
								activeRelease={activeRelease}
								versions={versions}
								hideVersions={integration.hide_versions}
								description={integration.description}
							/>

							<Tabs
								allowNestedStyles
								// translate slug to index
								initialActiveIndex={map.slugToIndex[tab]}
								onChange={handleTabChange}
							>
								<Tab heading="README">
									<ReactMarkdown>{activeRelease.readme}</ReactMarkdown>
								</Tab>
								{activeRelease.components.map((irc: ReleaseComponent) => {
									return irc.readme || irc.variable_groups.length ? (
										<Tab key={irc.component.id} heading={irc.component.name}>
											<ComponentTabContent component={irc} />
										</Tab>
									) : (
										<></>
									)
								})}
							</Tabs>
						</div>
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
