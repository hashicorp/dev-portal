import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
import BreadcrumbBar from 'components/breadcrumb-bar'
import DropdownDisclosure, {
	DropdownDisclosureButtonItem,
} from 'components/dropdown-disclosure'
import BaseLayout from 'layouts/base-new'
import { Integration, Release } from 'lib/integrations-api-client'
import ReactMarkdown from 'react-markdown'
import { ProductData } from 'types/products'
import TierBadge from '../product-integrations-landing/components/tier-badge'
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
	const otherVersions = integration.versions.sort().reverse().slice(1)
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
							<div className={s.topLine}>
								<div className={s.headingWrapper}>
									<h1>{integration.name}</h1>
									{integration.versions.length > 1 ? (
										<DropdownDisclosure
											className={s.versionDropdown}
											color="secondary"
											text={`Version ${latestRelease.version}`}
										>
											{otherVersions.map((version: string) => {
												return (
													<DropdownDisclosureButtonItem
														key={version}
														onClick={() => console.log(`Clicked ${version}`)}
													>
														Version {version}
													</DropdownDisclosureButtonItem>
												)
											})}
										</DropdownDisclosure>
									) : (
										<span className={s.version}>v{latestRelease.version}</span>
									)}
									<TierBadge
										tier={integration.tier}
										productSlug={integration.product.slug}
										size="large"
									/>
								</div>
								<a
									className={s.viewInGithub}
									href={integration.repo_url}
									target="_blank"
									rel="noreferrer"
								>
									<IconGithub16 /> View in GitHub
								</a>
							</div>
							<span className={s.org}>@{integration.organization.slug}</span>
							<ReactMarkdown>{latestRelease.readme}</ReactMarkdown>
						</div>
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
