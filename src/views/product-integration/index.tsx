import s from './style.module.css'
import BaseLayout from 'layouts/base-new'
import BreadcrumbBar from 'components/breadcrumb-bar'
import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
import TierBadge from '../product-integrations-landing/components/tier-badge'
import ReactMarkdown from 'react-markdown'

export default function ProductIntegrationLanding({ integration, product }) {
	return (
		<BaseLayout showFooterTopBorder>
			<div className={s.integrationPage}>
				<div className={s.sidebar}></div>
				<div className={s.mainArea}>
					<div className={s.contentWrapper}>
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
						<div className={s.content}>
							<div className={s.topLine}>
								<div className={s.headingWrapper}>
									<h1>{integration.name}</h1>
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
							<ReactMarkdown>{integration.readme}</ReactMarkdown>
						</div>
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
