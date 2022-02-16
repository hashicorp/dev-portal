const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const {
  addGlobalStyles,
  addProxyLayout,
  editFile,
  evalDataFile,
  patchSubnav,
  setupDocsRoute,
  setupProductMigration,
  setupIoLayout,
  setupSecurityPage,
} = require('./_shared')

migrateVagrantIo()

async function migrateVagrantIo() {
  const slug = 'vagrant'
  //
  // SETUP
  //
  // set up the source direction (cloned product repository)
  // and the destination directories (all within this project's source)
  const { repoDirs, destDirs } = await setupProductMigration(slug)
  //
  // DATA
  //
  // set up product data
  const { VERSION, VMWARE_UTILITY_VERSION } = JSON.parse(
    fs.readFileSync(path.join(repoDirs.data, 'version.json'), 'utf-8')
  )
  const productData = {
    name: 'Vagrant',
    slug,
    algoliaConfig: {
      indexName: 'product_VAGRANT',
      searchOnlyApiKey: '9bfec34ea54e56a11bd50d6bfedc5e71',
    },
    analyticsConfig: {
      includedDomains: 'vagrantup.com www.vagrantup.com',
      segmentWriteKey: 'qW11yxgipKMsKFKQUCpTVgQUYftYsJj0',
    },
    metadata: {
      title: 'Vagrant by HashiCorp',
      description:
        'Vagrant enables users to create and configure lightweight, reproducible, and portable development environments.',
      image: '/vagrant/img/og-image.png',
      icon: [{ href: '/vagrant/favicon.ico' }],
    },
    alertBannerActive: false,
    alertBanner: evalDataFile(path.join(repoDirs.data, 'alert-banner.js')),
    version: VERSION,
    vmwareUtilityVersion: VMWARE_UTILITY_VERSION,
    subnavItems: evalDataFile(path.join(repoDirs.data, 'subnav.js')),
  }
  // write product data to file
  await exec(`rm -f ./src/data/${slug}.json`)
  fs.writeFileSync(
    `./src/data/${slug}.json`,
    JSON.stringify(productData, null, 2) + '\n',
    'utf8'
  )
  //
  // DEPENDENCIES
  //
  // install dependencies required for proxied pages
  const npmDependencies = [
    'react-device-detect',
    'nuka-carousel',
    '@hashicorp/react-text-split-with-logo-grid',
  ]
  console.log('⏳ Installing dependencies...')
  // await exec(`npm i ${npmDependencies.join(' ')}`)
  console.log('✅ Done')
  //
  // ASSETS
  //
  console.log('⏳ Copying assets...')
  const assetsToCopy = [
    // meta images
    '/favicon.ico',
    '/img/og-image.png',
    // press kit
    // note: we have a redirect in place to allow consistent URL
    '/files/press-kit.zip',
    // homepage images
    '/img/logo-hashicorp.svg',
    '/img/vagrant-trusted-by-logos.png',
    '/img/vagrant_parity.svg',
    '/img/systems/apple.svg',
    '/img/systems/linux.svg',
    '/img/systems/windows.svg',
  ]
  for (let i = 0; i < assetsToCopy.length; i++) {
    const srcPath = `${repoDirs.public}/${assetsToCopy[i]}`
    const destPath = `${destDirs.public}/${assetsToCopy[i]}`
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    await exec(`cp -r ${srcPath} ${destPath}`)
  }
  console.log('✅ Done')
  //
  // COMPONENTS
  //
  // copy components into dedicated directory
  console.log('⏳ Copying components...')
  const missingComponents = [
    // layout
    'subnav',
    'footer',
    // home page
    'temporary_text-split',
    'vmware-purchase-form',
  ]
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${repoDirs.components}/${missingComponents[i]}`
    const destPath = `${destDirs.components}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  console.log('✅ Done')
  //
  // SUBNAV COMPONENT
  //
  // temporary fix for currentPath highlighting issue in subnav
  // TODO there must be a better way to do this?
  console.log('⏳ Updating subnav...')
  await patchSubnav(`${destDirs.components}/subnav/index.jsx`)
  // edit the subnav file to use the consolidated data file
  await editFile(`${destDirs.components}/subnav/index.jsx`, (contents) => {
    return contents
      .replace(
        "import subnavItems from '../../data/subnav'\n",
        "import productData from 'data/vagrant'\n"
      )
      .replace(/subnavItems/g, 'productData.subnavItems')
  })
  console.log('✅ Done')
  // /docs/providers/vmware
  //
  // FOOTER COMPONENT
  //
  // temporary fix for currentPath highlighting issue in subnav
  // TODO there must be a better way to do this?
  console.log('⏳ Updating footer...')
  // update the vmware footer entry not to redirect
  await editFile(`${destDirs.components}/footer/index.jsx`, (contents) => {
    return contents.replace(`href="/vmware"`, `href="/docs/providers/vmware"`)
  })
  console.log('✅ Done')
  //
  // LAYOUT
  //
  // setup the layout file for this product
  console.log('⏳ Setting up layout...')
  await setupIoLayout({ layoutDir: destDirs.layouts, productData })
  console.log('✅ Done')
  //
  // GLOBAL STYLES
  //
  // add the homepage stylesheet to our main style.css
  console.log('⏳ Setting up global styles...')
  // const missingStylesheets = [
  //   './_proxied-dot-io/nomad/home/style.css',
  //   '../components/_proxied-dot-io/nomad/case-study-carousel/style.css',
  //   '../components/_proxied-dot-io/nomad/footer/style.css',
  //   '../components/_proxied-dot-io/nomad/features-list/style.css',
  //   '../components/_proxied-dot-io/nomad/footer/style.css',
  //   '../components/_proxied-dot-io/nomad/homepage-hero/style.css',
  //   '../components/_proxied-dot-io/nomad/mini-cta/style.css',
  // ]
  // await addGlobalStyles({ missingStylesheets, productName: productData.name })
  console.log('✅ Done')
  //
  // PAGES FOLDER SETUP
  //
  // delete some page files we don't need
  console.log('⏳ Deleting unnecessary files...')
  const filesToDelete = [
    '_app.js',
    '_document.js',
    '_error.jsx',
    '404.jsx',
    '404.module.css',
    'print.css',
    'style.css',
    'index.jsx',
  ]
  for (let i = 0; i < filesToDelete.length; i++) {
    const filepath = path.join(destDirs.pages, filesToDelete[i])
    await exec(`rm -rf ${filepath}`)
  }
  console.log('✅ Done')
  //
  // HOME PAGE
  //
  // move home page from /home/index.jsx to /index.jsx,
  // to avoid duplicate route (or need for redirect)
  console.log('⏳ Updating homepage...')
  await exec(`mv ${destDirs.pages}/home/index.jsx ${destDirs.pages}/index.jsx`)
  // edit file to account for above changes
  await editFile(`${destDirs.pages}/index.jsx`, (contents) => {
    let newContents = contents
    // replace component import paths
    newContents = newContents.replace(
      /from 'components\//g,
      `from 'components/_proxied-dot-io/${productData.slug}/`
    )
    // add Vagrant layout
    newContents = addProxyLayout(newContents, 'HomePage', productData)
    // replace css modules paths
    newContents = newContents.replace(
      /from '\.\/style.module/g,
      `from './home/style.module`
    )
    // replace version data import
    newContents = newContents.replace(
      `import versions from 'data/version.json'`,
      `import config from 'data/vagrant.json'`
    )
    newContents = newContents.replace(`{versions.VERSION}`, `{config.version}`)
    // replace image paths
    newContents = newContents.replace(/\/img/g, `/vagrant/img`)
    // replace one-line default export, otherwise it's a duplicate
    newContents = newContents.replace(
      'export default function Homepage',
      'function HomePage'
    )
    // return
    return newContents
  })
  console.log('✅ Done')
  //
  // DOCS routes
  //
  const docsRoutes = ['docs', 'intro', 'vagrant-cloud', 'vmware']
  for (var i = 0; i < docsRoutes.length; i++) {
    const basePath = docsRoutes[i]
    // delete existing docs page
    await exec(
      `rm -f ${path.join(destDirs.pages, basePath, '[[...page]].jsx')}`
    )
    // use template
    await setupDocsRoute({
      pagesDir: destDirs.pages,
      basePath,
      productData,
    })
  }
  //
  // COMMUNITY PAGE
  //
  await editFile(`${destDirs.pages}/community/index.jsx`, (contents) => {
    return addProxyLayout(contents, 'CommunityPage', productData)
  })
  //
  // DOWNLOADS PAGE
  //
  await exec(
    `cp _temp-migrations-assets/vagrant/downloads-index.jsx ${destDirs.pages}/downloads/index.jsx`
  )
  await exec(
    `cp _temp-migrations-assets/vagrant/vmware-downloads-index.jsx ${destDirs.pages}/vmware/downloads/index.jsx`
  )
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })
}
