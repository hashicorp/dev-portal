import proxiedLayouts from 'layouts/_proxied-dot-io/dict'
import { getProxiedProductSlug } from 'lib/env-checks'
import NotFound from './404'
import Bugsnag from '@hashicorp/platform-runtime-error-monitoring'

function Error({ statusCode }) {
  return <NotFound statusCode={statusCode} />
}

Error.getInitialProps = ({ res, err }) => {
  if (err) Bugsnag.notify(err)
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

Error.layout = proxiedLayouts[getProxiedProductSlug()]
export default Error
