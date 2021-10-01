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
const blockSecretHomepageRedirect = Object.entries(DOMAIN_MAP).map(
  ([product, domain]) => ({
    source: `/${product}/_secret-io-homepage`,
    destination: domain,
    has: [
      {
        type: 'host',
        value: '(dev.hashicorp.com|developer.hashicorp.com)',
      },
    ],
    permanent: false,
  })
)

module.exports = (async () => {
  return [...blockSecretHomepageRedirect]
})()
