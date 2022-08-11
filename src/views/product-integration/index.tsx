import s from './style.module.css'
import BaseLayout from 'layouts/base-new'
import BreadcrumbBar from 'components/breadcrumb-bar'

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
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
