module.exports = {
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
  // nomad: {
  //   domain: 'https://test-nm.hashi-mktg.com',
  //   host: 'test-nm.hashi-mktg.com',
  //   assets: [],
  // },
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
  // vault: {
  //   domain: 'https://test-vt.hashi-mktg.com',
  //   host: 'test-vt.hashi-mktg.com',
  //   assets: [],
  // },
  waypoint: {
    // actually https://waypointproject.io, but using wp.snarglepuss.com as a test
    domain: 'https://wp.snarglepuss.com',
    host: 'wp.snarglepuss.com',
    assets: ['/files/press-kit.zip'],
  },
}
