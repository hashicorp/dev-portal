import BreadcrumbBar from 'components/breadcrumb-bar'
import Tabs, { Tab } from 'components/tabs'
import BaseLayout from 'layouts/base-new'
import { Integration, Release } from 'lib/integrations-api-client'
import ReactMarkdown from 'react-markdown'
import { ProductData } from 'types/products'
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
								description={integration.description}
							/>

							<Tabs allowNestedStyles>
								<Tab heading="README">
									<ReactMarkdown>{latestRelease.readme}</ReactMarkdown>
								</Tab>
								<Tab heading="Documentation">
									<p>Documentation Tree goes here</p>
								</Tab>

								<Tab heading="Builder">
									<h3>docker (builder)</h3>
									<p>Build a Docker image from a Dockerfile.</p>
									<p>
										If a Docker server is available (either locally or via
										environment variables such as DOCKER_HOST), then docker
										build will be used to build an image from a Dockerfile.
									</p>
									<p>
										Dockerless Builds Many hosted environments, such as
										Kubernetes clusters, don&apos;t provide access to a Docker
										server. In these cases, it is desirable to perform what is
										called a dockerless build: building a Docker image without
										access to a Docker daemon. Waypoint supports dockerless
										builds. Waypoint performs Dockerless builds by leveraging
										Kaniko within on-demand launched runners. This should work
										in all supported Waypoint installation environments by
										default and you should not have to specify any additional
										configuration.
									</p>

									<Tabs allowNestedStyles>
										<Tab heading="Parameters">
											<p>wow</p>
										</Tab>
										<Tab heading="Outputs">
											<p>wow</p>
										</Tab>
									</Tabs>
								</Tab>
								<Tab heading="Registry">
									<p>TODO</p>
								</Tab>
								<Tab heading="Platform">
									<p>TODO</p>
								</Tab>
								<Tab heading="Task">
									<p>TODO</p>
								</Tab>
							</Tabs>
						</div>
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
