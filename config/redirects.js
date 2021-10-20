const proxySettings = require('./proxy-settings')

// const DOMAIN_MAP = {
//   boundary: 'https://boundaryproject.io',
//   consul: 'https://consul.io',
//   hcp: 'https://cloud.hashicorp.com',
//   nomad: 'https://nomadproject.io',
//   packer: 'https://packer.io',
//   terraform: 'https://terraform.io',
//   vagrant: 'https://vagrantup.com',
//   vault: 'https://vaultproject.io',
//   waypoint: 'https://waypointproject.io',
// }

// Redirect all proxied Waypoint pages
// to the Waypoint project domain
// (we do this regardless of which domain we're serving from)
// TODO: should work for all routes on all products
// for now, just testing for manually specific waypoint routes...
// 2. expand to all routes for all products
// 3. find way to abstract the above so it's not repetitive, if it makes sense
//    ... maybe read in from pages folder or something, if that makes sense?
// TODO: we want to apply these redirects on the live site, but not in local dev
// one way to achieve this would be with a "has" entry. However, for local dev
// we'll likely be doing other env-based stuff, so it may be easier to just remove
// these redirects in dev rather than list specific production hosts.
const waypointDomain = proxySettings.waypoint.domain
const waypointProxyRedirects = proxySettings.waypoint.routesToProxy.map(
  ({ proxiedRoute, projectPage }) => {
    return {
      source: projectPage,
      destination: waypointDomain + proxiedRoute,
      permanent: false,
    }
  }
)

async function redirectsConfig() {
  return [...waypointProxyRedirects]
}

module.exports = redirectsConfig
