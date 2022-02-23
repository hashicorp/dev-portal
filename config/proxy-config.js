//@ts-check

/**
 * @typedef {Object} SiteProxyConfig
 * @property {string} domain
 * @property {string} host
 * @property {string[]} assets
 */

/**
 * @type {Record<string, SiteProxyConfig>}
 */
const proxyConfig = {
  boundary: {
    domain: 'https://www.boundaryproject.io',
    host: '(www\\.boundaryproject\\.io|test-bd\\.hashi-mktg\\.com)',
    assets: [
      '/files/press-kit.zip',
      '/data/vault/boundary-controller-policy.hcl',
    ],
  },
  // consul: {
  //   domain: 'https://test-cs.hashi-mktg.com',
  //   host: 'test-cs.hashi-mktg.com',
  //   assets: [],
  // },
  nomad: {
    domain: 'https://www.nomadproject.io',
    host: '(www\\.nomadproject\\.io|test-nm\\.hashi-mktg\\.com)',
    assets: [
      '/files/press-kit.zip',
      '/data/vault/nomad-server-policy.hcl',
      '/data/vault/nomad-cluster-role.json',
    ],
  },
  packer: {
    domain: 'https:/www.packer.io',
    host: '(www\\.packer\\.io|test-pk\\.hashi-mktg\\.com)',
    assets: ['/files/press-kit.zip'],
  },
  sentinel: {
    // actually https://docs.hashicorp.com, but using test-st.hashi-mktg.com as a test
    domain: 'https://test-st.hashi-mktg.com',
    host: 'test-st.hashi-mktg.com',
    assets: [],
  },
  // terraform: {
  //   domain: 'https://test-tf.hashi-mktg.com',
  //   host: 'test-tf.hashi-mktg.com',
  //   assets: [],
  // },
  vagrant: {
    domain: 'https://www.vagrantup.com',
    host: '(www\\.vagrantup\\.com|test-vg\\.hashi-mktg\\.com)',
    assets: ['/files/press-kit.zip'],
  },
  vault: {
    domain: 'https://test-vt.hashi-mktg.com',
    host: 'test-vt.hashi-mktg.com',
    assets: ['/files/press-kit.zip'],
  },
  waypoint: {
    domain: 'https://www.waypointproject.io',
    host: '(www\\.waypointproject\\.io|test-wp\\.hashi-mktg\\.com)',
    assets: ['/files/press-kit.zip'],
  },
}

module.exports = proxyConfig
