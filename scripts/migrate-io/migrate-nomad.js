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

migrateNomadIo()

async function migrateNomadIo() {
  const slug = 'nomad'
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
  const productData = {
    name: 'Nomad',
    slug,
    algoliaConfig: {
      indexName: 'product_NOMAD',
      searchOnlyApiKey: '9bfec34ea54e56a11bd50d6bfedc5e71',
    },
    analyticsConfig: {
      includedDomains: 'nomadproject.io www.nomadproject.io',
      segmentWriteKey: 'qW11yxgipKMsKFKQUCpTVgQUYftYsJj0',
    },
    metadata: {
      title: 'Nomad by HashiCorp',
      description:
        'Nomad is a highly available, distributed, data-center aware cluster and application scheduler designed to support the modern datacenter with support for long-running services, batch jobs, and much more.',
      image: '/nomad/img/og-image.png',
      icon: [{ href: '/nomad/_favicon.ico' }],
    },
    alertBannerActive: false,
    alertBanner: evalDataFile(path.join(repoDirs.data, 'alert-banner.js')),
    version: evalDataFile(path.join(repoDirs.data, 'version.js')),
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
    '/_favicon.ico',
    '/img/og-image.png',
    '/img/nomad-bg-pattern.svg',
    // press kit
    // note: we have a redirect in place to allow consistent URL
    '/files/press-kit.zip',
    '/data/vault/nomad-server-policy.hcl',
    '/data/vault/nomad-cluster-role.json',
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
    'comparison-callouts',
    'features-list',
    'homepage-hero',
    'case-study-carousel',
    'mini-cta',
  ]
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${repoDirs.components}/${missingComponents[i]}`
    const destPath = `${destDirs.components}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  // replace image path for hero background
  await editFile(
    `${destDirs.components}/homepage-hero/style.css`,
    (fileString) =>
      fileString.replace(
        '/img/nomad-bg-pattern.svg',
        "'/nomad/img/nomad-bg-pattern.svg'"
      )
  )
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
        "import productData from 'data/nomad'\n"
      )
      .replace(/subnavItems/g, 'productData.subnavItems')
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
  const missingStylesheets = [
    './_proxied-dot-io/nomad/home/style.css',
    '../components/_proxied-dot-io/nomad/case-study-carousel/style.css',
    '../components/_proxied-dot-io/nomad/footer/style.css',
    '../components/_proxied-dot-io/nomad/features-list/style.css',
    '../components/_proxied-dot-io/nomad/footer/style.css',
    '../components/_proxied-dot-io/nomad/homepage-hero/style.css',
    '../components/_proxied-dot-io/nomad/mini-cta/style.css',
  ]
  await addGlobalStyles({ missingStylesheets, productName: productData.name })
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
    'print.css',
    'style.css',
    'index.jsx',
    'not-found',
    // TODO: note that this is live on the current website,
    // TODO: but dropped on main. We're going with the
    // TODO: dropped-on-main version.
    'use-cases',
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
    // add Boundary layout
    newContents = addProxyLayout(newContents, 'HomePage', productData)
    // replace require image paths
    newContents = newContents.replace(
      /require\('\.\/img/g,
      `require('./home/img`
    )
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
  const docsRoutes = ['api-docs', 'docs', 'intro', 'plugins', 'tools']
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
  // hide version select on /plugins and /tools
  for (const basePath of ['plugins', 'tools']) {
    await editFile(
      path.join(destDirs.pages, basePath, '[[...page]].tsx'),
      (contents) => {
        let newContents = contents
        newContents = newContents.replace(
          'showVersionSelect={enableVersionedDocs}',
          'showVersionSelect={false}'
        )
        return newContents
      }
    )
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
    `cp _temp-migrations-assets/nomad/downloads-index.jsx ${destDirs.pages}/downloads/index.jsx`
  )
  await exec(
    `cp _temp-migrations-assets/nomad/downloads-enterprise.jsx ${destDirs.pages}/downloads/enterprise.jsx`
  )
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })
}
