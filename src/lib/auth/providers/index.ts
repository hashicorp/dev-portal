import { AuthProvider, ValidAuthProviderId } from 'types/auth'
import CloudIdpProvider from './cloud-idp-provider'

/**
 * An object map of auth provider IDs to their associated AuthProvider object.
 */
const providers: { [key in ValidAuthProviderId]: AuthProvider } = {
	[ValidAuthProviderId.CloudIdp]: CloudIdpProvider,
}

export default providers
