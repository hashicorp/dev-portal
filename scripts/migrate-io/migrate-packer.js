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
  setupMarkdownPage,
  setupSecurityPage,
  setupProductMigration,
  setupIoLayout,
} = require('./_shared')

migratePackerIo()

async function migratePackerIo() {
  const slug = 'packer'
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
    name: 'Packer',
    slug,
    algoliaConfig: {
      indexName: 'product_PACKER',
      searchOnlyApiKey: '4e1ea7f4bf4335ac43d9f28463e42148',
    },
    metadata: {
      title: 'Packer by HashiCorp',
      description:
        'Packer is a free and open source tool for creating golden images for multiple platforms from a single source configuration.',
      image: '/packer/img/og-image.png',
      icon: [{ href: '/packer/favicon.ico' }],
    },
    alertBannerActive: true,
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
    '@hashicorp/react-product-features-list',
    '@hashicorp/react-text-split-with-image',
    '@hashicorp/react-command-line-terminal',
  ]
  console.log('⏳ Installing dependencies...')
  // await exec(`npm i ${npmDependencies.join(' ')}`)
  console.log('✅ Done')
  //
  // ASSETS
  //
  const assetsToCopy = [
    // meta images
    '/favicon.ico',
    '/img/og-image.png',
    // press kit
    // note: we have a redirect in place to allow consistent URL
    '/files/press-kit.zip',
    // home page assets
    '/img/product-features-list/deployment.svg',
    '/img/product-features-list/portability.svg',
    '/img/product-features-list/stability.svg',
    '/img/product-features-list/prod-parity.svg',
    '/img/product-features-list/continuous-delivery.svg',
    '/img/product-features-list/demo-creation.svg',
    '/img/hcp-callout.svg',
    '/img/integrations-text-split/integrations.png',
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
    'animated-terminal',
    'branded-cta',
    'homepage-hero',
    'integrations-text-split',
    'section-break-cta',
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
        "import subnavItems from 'data/subnav'\n",
        "import productData from 'data/packer'\n"
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
  // add global stylesheets to our main style.css
  const missingStylesheets = [
    '../components/_proxied-dot-io/packer/footer/style.css',
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
    // add Packer layout
    newContents = addProxyLayout(newContents, 'HomePage', productData)
    // replace require image paths
    newContents = newContents.replace(/'\/img/g, "'/packer/img")
    // replace one-line default export, otherwise it's a duplicate
    newContents = newContents.replace(
      'export default function Homepage',
      'function HomePage'
    )
    // fix style import
    newContents = newContents.replace(
      './style.module.css',
      './home/style.module.css'
    )
    // return
    return newContents
  })
  //
  // COMMUNITY MDX PAGES
  //
  // community-tools.mdx
  setupMarkdownPage({
    pageFilePath: `${destDirs.pages}/community-tools.jsx`,
    productData,
    localFilePath: '../content/community-tools.mdx',
    remoteFilePath: 'website/content/community-tools.mdx',
    remoteVersion: 'refs/heads/stable-website',
  })
  // community-plugins.mdx
  setupMarkdownPage({
    pageFilePath: `${destDirs.pages}/community-plugins.jsx`,
    productData,
    localFilePath: '../content/community-plugins.mdx',
    remoteFilePath: 'website/content/community-plugins.mdx',
    remoteVersion: 'refs/heads/stable-website',
  })
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a template
  await exec(`rm -f ${path.join(destDirs.pages, 'security.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })
}
