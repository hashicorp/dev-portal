import { PlatformOptionRedirectData } from '../types'
import { getLearnRedirectPath } from './get-learn-redirect-path'
import { getIoRedirectPath } from './get-io-redirect-path'

export const PLATFORM_OPTIONS: PlatformOptionRedirectData = {
  learn: {
    base_url: 'https://learn.hashicorp.com',
    getRedirectPath: getLearnRedirectPath,
    cookieKey: 'learn-beta-opt-in',
    cookieAnalyticsKey: 'learn-beta-opt-in-tracked',
  },
  'waypoint-io': {
    base_url: 'https://www.waypointproject.io/',
    getRedirectPath(path) {
      const url = new URL(getIoRedirectPath(path), this.base_url)

      url.searchParams.set('betaOptOut', 'true')

      // ensure we don't create a looping scenario if someone opts out immediately after opting-in
      url.searchParams.delete('optInFrom')

      return url.toString()
    },
    cookieKey: 'waypoint-io-beta-opt-in',
    cookieAnalyticsKey: 'waypoint-io-beta-opt-in-tracked',
  },
  'vault-io': {
    base_url: 'https://www.vaultproject.io/',
    getRedirectPath(path) {
      const url = new URL(getIoRedirectPath(path), this.base_url)

      url.searchParams.set('betaOptOut', 'true')

      // ensure we don't create a looping scenario if someone opts out immediately after opting-in
      url.searchParams.delete('optInFrom')

      return url.toString()
    },
    cookieKey: 'vault-io-beta-opt-in',
    cookieAnalyticsKey: 'vault-io-beta-opt-in-tracked',
  },
}
