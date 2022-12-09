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

							<Tabs allowNestedStyles>
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
