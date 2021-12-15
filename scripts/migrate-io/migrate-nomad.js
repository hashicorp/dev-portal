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
    // TODO: note that subnav items on nomad main branch
    // TODO: include /plugins and /tools docs paths.
    // TODO: content has not been extracted yet,
    // TODO: so we remove these subnav items, for now.
    subnavItems: evalDataFile(path.join(repoDirs.data, 'subnav.js')).filter(
      (item) => {
        return item.url !== '/plugins' && item.url !== '/tools'
      }
    ),
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
  const assetsToCopy = [
    // meta images
    '/_favicon.ico',
    '/img/og-image.png',
    // press kit
    // note: we have a redirect in place to allow consistent URL
    '/files/press-kit.zip',
  ]
  for (let i = 0; i < assetsToCopy.length; i++) {
    const srcPath = `${repoDirs.public}/${assetsToCopy[i]}`
    const destPath = `${destDirs.public}/${assetsToCopy[i]}`
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    await exec(`cp -r ${srcPath} ${destPath}`)
  }
  //
  // COMPONENTS
  //
  // copy components into dedicated directory
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
  //
  // SUBNAV COMPONENT
  //
  // temporary fix for currentPath highlighting issue in subnav
  // TODO there must be a better way to do this?
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
  //
  // LAYOUT
  //
  // setup the layout file for this product
  await setupIoLayout({ layoutDir: destDirs.layouts, productData })
  //
  // GLOBAL STYLES
  //
  // add the homepage stylesheet to our main style.css
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
  //
  // PAGES FOLDER SETUP
  //
  // delete some page files we don't need
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
  //
  // HOME PAGE
  //
  // move home page from /home/index.jsx to /index.jsx,
  // to avoid duplicate route (or need for redirect)
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
    // make homepage CSS [GPS](https://github.com/jescalan/gps) id more specific
    newContents = newContents.replace(/p-home/g, 'p-home-nomad')
    // return
    return newContents
  })
  // make homepage CSS [GPS](https://github.com/jescalan/gps) id more specific
  await editFile(`${destDirs.pages}/home/style.css`, (contents) => {
    return contents.replace(/p-home/g, 'p-home-nomad')
  })
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
  // TODO: temporary fix for docs routes that
  // TODO: haven't been ETL'd yet
  for (var i = 3; i < docsRoutes.length; i++) {
    const basePath = docsRoutes[i]
    await editFile(
      path.join(destDirs.pages, basePath, '[[...page]].tsx'),
      (contents) => {
        let newContents = contents
        // replace component import paths
        newContents = newContents
          .replace('{ getStaticPaths, getStaticProps }', `staticGenFns`)
          .replace(
            'export { getStaticPaths, getStaticProps }\n',
            `// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getStaticPaths(ctx) {
  // TODO: content is not yet extracted, because
  // TODO: this docs path does not exist on stable-website,
  // TODO: only on main (unreleased).
  // TODO: need to consider what approach we'll take
  // TODO: during migration if website code on main
  // TODO: is significantly different (slash breaks)
  // TODO: compared to website code on stable-website.
  if (enableVersionedDocs) return { paths: [], fallback: 'blocking' }
  return staticGenFns.getStaticPaths(ctx)
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getStaticProps(ctx) {
  return staticGenFns.getStaticProps(ctx)
}\n`
          )
        // return
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
  await editFile(`${destDirs.pages}/downloads/index.jsx`, (contents) => {
    let newContents = contents
      .replace(
        "import VERSION from 'data/version'\nimport { productSlug } from 'data/metadata'",
        "import productData from 'data/nomad'"
      )
      .replace(/productSlug/g, 'productData.slug')
      .replace('latestVersion: VERSION', 'latestVersion: productData.version')
    newContents = addProxyLayout(newContents, 'DownloadsPage', productData)
    return newContents
  })
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })
}
