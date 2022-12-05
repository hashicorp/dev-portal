import s from './style.module.css'
import BaseLayout from 'layouts/base-new'
import BreadcrumbBar from 'components/breadcrumb-bar'
import FacetedIntegrationList from './components/faceted-integrations-list'
import { ProductData } from 'types/products'
import { Integration } from 'lib/integrations-api-client/integration'

interface ViewProps {
	product: ProductData
	integrations: Array<Integration>
}

export default function ProductIntegrationsLanding({
	product,
	integrations,
}: ViewProps) {
	return (
		<BaseLayout showFooterTopBorder>
			<div className={s.integrationsLandingPage}>
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
										isCurrentPage: true,
									},
								]}
							/>
						</div>
						<FacetedIntegrationList integrations={integrations} />
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
