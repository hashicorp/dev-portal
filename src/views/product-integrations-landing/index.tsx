import s from './style.module.css'
import BaseLayout from 'layouts/base-new'
import BreadcrumbBar from 'components/breadcrumb-bar'
import FacetedIntegrationList from './components/faceted-integrations-list'

export default function ProductIntegrationsLanding({ product, integrations }) {
	return (
		<BaseLayout showFooterTopBorder>
			<div className={s.integrationsLandingPage}>
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
									isCurrentPage: true,
								},
							]}
						/>
						<FacetedIntegrationList integrations={integrations} />
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
