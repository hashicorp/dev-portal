import { Integration } from 'lib/integrations-api-client/integration'

const getHrefForIntegration = (integration: Integration) => {
	return integration.external_only
		? integration.external_url.replace(/^https:\/\/developer.hashicorp.com/, '')
		: `/${integration.product.slug}/integrations/${integration.slug}`
}

export { getHrefForIntegration }
