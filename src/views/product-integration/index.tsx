import BreadcrumbBar from 'components/breadcrumb-bar'
import Tabs, { Tab } from 'components/tabs'
import BaseLayout from 'layouts/base-new'
import { Integration, Release } from 'lib/integrations-api-client'
import ReactMarkdown from 'react-markdown'
import { ProductData } from 'types/products'
import ComponentTabContent from './components/component-tab-content'
import Header from './components/header'
import s from './style.module.css'

interface ViewProps {
	integration: Integration
	product: ProductData
	latestRelease: Release
}

export default function ProductIntegrationLanding({
	integration,
	product,
	latestRelease,
}: ViewProps) {
	return (
		<BaseLayout showFooterTopBorder>
			<div className={s.integrationPage}>
				<div className={s.sidebar}></div>
				<div className={s.mainArea}>
					<div className={s.contentWrapper}>
						<div className={s.breadcrumbWrapper}>
							<BreadcrumbBar
								links={[
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
										isCurrentPage: false,
									},
									{
										title: integration.name,
										url: `/${product.slug}/integrations/${integration.slug}`,
										isCurrentPage: true,
									},
								]}
							/>
						</div>
						<div className={s.content}>
							<Header
								className={s.header}
								name={integration.name}
								tier={integration.tier}
								author={integration.organization.slug}
								versions={integration.versions}
								hideVersions={integration.hide_versions}
								description={integration.description}
							/>

							<Tabs allowNestedStyles>
								<Tab heading="README">
									<ReactMarkdown>{latestRelease.readme}</ReactMarkdown>
								</Tab>
								<Tab heading="Documentation">
									<p>TODO: A Tree of documentation would go here</p>
								</Tab>
								{latestRelease.components.map((irc) => {
									const component = irc.component
									return (
										<Tab key="foo" heading={component.name}>
											<ComponentTabContent component={component} />
										</Tab>
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
