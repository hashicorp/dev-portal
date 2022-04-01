import BaseLayout from 'layouts/base'
import proxiedLayouts from 'layouts/_proxied-dot-io/dict'
import { getProxiedProductSlug } from 'lib/env-checks'
import { VersionedErrorPage } from 'views/_proxied-dot-io/versioned-error'
import fetchLayoutProps from 'lib/_proxied-dot-io/fetch-layout-props'

// resolve a default export
function resolve(obj) {
  return obj && obj.__esModule ? obj.default : obj
}

function Error({ statusCode, proxiedProductSlug, layoutProps }) {
  // Unlike other pages, we can't use redirects and rewrites
  // to display proxied .io domain 404 pages on specific hosts.
  // Instead, we must use getServerSideProps to determine which
  // layout to show at request time.
  // ---
  // This isn't as efficient as it could be.
  // A possible alternative may be to set specific branches
  // on each proxied domain via Vercel's domain configuration.
  // These branches would be completely identical to `main`...
  // which seems inconvenient, having so many identical branches...
  // BUT this setup would allow us to determine AT BUILD TIME
  // whether we need to show a proxied product layout. We would
  // know from Vercel's GIT_COMMIT_REF System Environment Variable
  // (https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables)
  // which unlike `host` or `hostname` is accessible at build-time
  // and does not require getServerSideProps to determine.
  // (we could use getStaticProps instead, and we could therefore
  // have a separate, static 404 page, which had to be replaced with
  // a server-generated 404 in order to enable per-product layouts).
  // ---
  // If we were to take the above approach, with separate branches
  // per proxied domain, our workflows could still be the same:
  // everything production would be on main, and we'd do all work
  // on main.
  // To achieve this workflow parity, we would need to:
  // - implement a GitHub action workflow, that, on commits to `main`,
  //   would automatically sync all "proxied product branches" to hard-reset
  //   them to `main`. (One way sync: `main` >> `proxied-{product}`)
  // - add branch protection on all `proxied-{product}` branches. Since
  //   we'd be syncing them one way, constantly overwriting them with
  //   the latest work in `main`, we would want to ensure folks don't
  //   accidentally push work that they intend to deploy to these branches.
  // In addition, if we went this direction, we could also consider
  // using the same GIT_COMMIT_REF strategy for redirects. Rather than
  // having a host-specific `has` condition on redirects and rewrites,
  // we would instead generate specific sets of redirects based on the
  // whether the current branch is a specific `proxied-{product}` branch.
  const Layout = proxiedLayouts[proxiedProductSlug] || BaseLayout
  return (
    <Layout data={...layoutProps}>
      <VersionedErrorPage statusCode={statusCode} />
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const { req, res, err } = ctx
  // Determine which layout to use, may be dev-portal's base layout,
  // or may be a proxied product layout, depending on the URL host
  const urlObj = new URL(req.url, `http://${req.headers.host}`)
  // In preview environments, we can force the app into a certain .io mode with the io_preview cookie
  const ioPreviewProduct =
    process.env.HASHI_ENV === 'preview' ? req.cookies['io_preview'] : null

  const proxiedProductSlug =
    ioPreviewProduct ?? getProxiedProductSlug(urlObj.hostname)

  // Determine which statusCode to show
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  if (statusCode === 404) {
    // cache 404 for one day
    res.setHeader('Cache-Control', 's-maxage=86400')
  }

  const layout = resolve(await proxiedLayouts[proxiedProductSlug].preload())

  const layoutProps = await fetchLayoutProps(layout, ctx)

  return {
    props: {
      statusCode,
      proxiedProductSlug,
      hostname: urlObj.hostname,
      layoutProps,
    },
  }
}

Error.layout = ({ children }) => <>{children}</>
export default Error
