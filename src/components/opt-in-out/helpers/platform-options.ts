import { PlatformOptionRedirectData } from '../types'
import { getLearnRedirectPath } from './get-learn-redirect-path'
import { getIoRedirectPath } from './get-io-redirect-path'

export const PLATFORM_OPTIONS: PlatformOptionRedirectData = {
  learn: {
    base_url: 'https://learn-git-ksspike-opt-in-redirects-hashicorp.vercel.app', // FOR TESTING PURPOSES NEED TO UPDATE for - 'https://learn.hashicorp.com/'
    getRedirectPath: getLearnRedirectPath,
    cookieKey: 'learn-beta-opt-in',
    cookieAnalyticsKey: 'learn-beta-opt-in-tracked',
  },
  'waypoint-io': {
    base_url: 'https://www.waypointproject.io/',
    getRedirectPath(path) {
      return this.base_url + getIoRedirectPath(path)
    },
    cookieKey: 'waypoint-io-beta-opt-in',
    cookieAnalyticsKey: 'waypoint-io-beta-opt-in-tracked',
  },
  'vault-io': {
    base_url: 'https://www.vaultproject.io/',
    getRedirectPath(path) {
      return this.base_url + getIoRedirectPath(path)
    },
    cookieKey: 'vault-io-beta-opt-in',
    cookieAnalyticsKey: 'vault-io-beta-opt-in-tracked',
  },
}
