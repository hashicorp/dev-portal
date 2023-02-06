import { Profile } from 'next-auth'
import { Provider } from 'next-auth/providers'
import { ValidAuthProviderId } from 'types/auth'

type CloudIdpProviderConfig = Provider & {
	wellKnown: string
	authorization: {
		params: {
			scope: string
		}
	}
	idToken: boolean
	checks: string[]
	clientId: string
	clientSecret: string
	client: {
		name: string
		token_endpoint_auth_method: string
	}
	profile(profile: Profile): Profile
}

/**
 * A custom next-auth provider to authenticate via HashiCorp's Cloud IDP service
 */
const CloudIdpProvider: CloudIdpProviderConfig = {
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
	profile(profile: Profile) {
		return { id: profile.sub, ...profile }
	},
}

export default CloudIdpProvider
