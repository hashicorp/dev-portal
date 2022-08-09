export default function ProductIntegrationsLanding({ product }) {
	console.log('IntegrationsLanding1:', product)
	console.log('IntegrationsLanding2:', product.slug)

	return <div>{JSON.stringify(product)}</div>
}
