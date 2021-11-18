import proxiedLayouts from 'layouts/_proxied-dot-io/dict'
import { getProxiedProductSlug } from 'lib/env-checks'
import NotFound from 'views/404'

NotFound.layout = proxiedLayouts[getProxiedProductSlug()]
export default NotFound
