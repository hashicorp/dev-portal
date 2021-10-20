const DOMAIN_MAP = {
  boundary: 'https://boundaryproject.io',
  consul: 'https://consul.io',
  hcp: 'https://cloud.hashicorp.com',
  nomad: 'https://nomadproject.io',
  packer: 'https://packer.io',
  terraform: 'https://terraform.io',
  vagrant: 'https://vagrantup.com',
  vault: 'https://vaultproject.io',
  waypoint: 'https://waypointproject.io',
}

// loop over DOMAIN_MAP to create an entry that blocks
// the /:product/_secret-io-homepage path from loading on dev-portal in
// production. this page should only be accessed via proxy for the
// individual project domains
// TODO: we want to apply this on the live site, but may not want to apply it in local dev
// one way to achieve this would be with a "has" entry. However, for local dev
// we'll likely be doing other env-based stuff, so it may be easier to just remove
// these redirects in dev rather than list specific production hosts.
const blockSecretHomepageRedirects = Object.entries(DOMAIN_MAP).map(
  ([product, domain]) => ({
    source: `/${product}/_secret-io-homepage`,
    destination: domain,
    permanent: false,
  })
)

// TODO: should work for all routes on all products
// for now, just testing a specific waypoint route...
// 1. expand to all waypoint routes
// 2. expand to all routes for all products
// 3. find way to abstract the above so it's not repetitive, if it makes sense
const internalRedirectTests = [
  {
    source: '/waypoint/docs',
    destination: '/docs',
    permanent: false,
  },
]

async function redirectsConfig() {
  return [...blockSecretHomepageRedirects, ...internalRedirectTests]
}

module.exports = redirectsConfig
