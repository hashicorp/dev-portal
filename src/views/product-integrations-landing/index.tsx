import { useState, useEffect } from 'react'
import BaseLayout from 'layouts/base-new'
import BreadcrumbBar from 'components/breadcrumb-bar'
import IntegrationsList from './components/integrations-list'

// TODO, hardcoding this for now but will need to adjust later
const INTEGRATIONS_API_BASE_URL = 'http://localhost:5000'

export default function ProductIntegrationsLanding({ product }) {
	// Fetch integrations
	const [integrations, setIntegrations] = useState(null)
	useEffect(() => {
		fetch(
			`${INTEGRATIONS_API_BASE_URL}/products/${product.slug}/integrations`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
			.then((res) => res.json())
			.then((res) => {
				setIntegrations(res.result)
			})
	}, [])

	return (
		<BaseLayout showFooterTopBorder>
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

			<h1>{product.name} Integrations</h1>
			{integrations && <IntegrationsList integrations={integrations} />}
		</BaseLayout>
	)
}
