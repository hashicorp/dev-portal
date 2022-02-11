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
    // actually https://boundaryproject.io, but using test-bd.hashi-mktg.com as a test
    domain: 'https://test-bd.hashi-mktg.com',
    host: 'test-bd.hashi-mktg.com',
    assets: ['/files/press-kit.zip'],
  },
  // consul: {
  //   domain: 'https://test-cs.hashi-mktg.com',
  //   host: 'test-cs.hashi-mktg.com',
  //   assets: [],
  // },
  nomad: {
    domain: 'https://www.nomadproject.io',
    host: '(www\\.nomadproject\\.io|test-nm\\.hashi-mktg\\.com)',
    assets: ['/files/press-kit.zip'],
  },
  // packer: {
  //   domain: 'https://test-pk.hashi-mktg.com',
  //   host: 'test-pk.hashi-mktg.com',
  //   assets: [],
  // },
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
  // vagrant: {
  //   domain: 'https://test-vg.hashi-mktg.com',
  //   host: 'test-vg.hashi-mktg.com',
  //   assets: [],
  // },
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
