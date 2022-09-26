import { Provider } from 'next-auth/providers'
import { ValidAuthProviderId } from 'types/auth'

/**
 * A custom next-auth provider to authenticate via HashiCorp's Cloud IDP service
 */
const CloudIdpProvider: Provider = {
	id: ValidAuthProviderId.CloudIdp,
	name: 'Cloud IDP',
	type: 'oauth',
	wellKnown:
		__config.dev_dot.auth.idp_url + '/.well-known/openid-configuration',
	authorization: { params: { scope: 'openid offline_access' } },
	idToken: true,
	checks: ['pkce', 'state'],
	clientId: process.env.AUTH_CLIENT_ID,
	clientSecret: process.env.AUTH_CLIENT_SECRET,
	client: {
		name: 'HashiCorp Developer',
		token_endpoint_auth_method: 'client_secret_post',
	},
	profile(profile) {
		return { id: profile.sub, ...profile }
	},
}

export default CloudIdpProvider
