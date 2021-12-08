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
  setupSecurityPage,
  setupIoLayout,
} = require('./_shared')

/*

NOTE: ADDITIONAL MANUAL STEPS

- set up layout in ./src/layouts/_proxied-dot-io/sentinel

*/

migrateSentinelIo()

async function migrateSentinelIo() {
  const slug = 'sentinel'
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
    name: 'Sentinel',
    slug,
    algoliaConfig: {
      indexName: 'product_SENTINEL',
      searchOnlyApiKey: '55606ae6b6c797d30a84aa0b509711ef',
    },
    metadata: {
      title: 'Sentinel by HashiCorp',
      description:
        'Sentinel is a language and framework for policy built to be embedded in existing software to enable fine-grained, logic-based policy decisions.',
      image: '/sentinel/img/og-image.png', // TODO: need to create this OpenGraph image. Something simple.
      icon: [{ href: '/sentinel/_favicon.ico' }], // TODO: need to create this favicon. HashiCorp icon?
    },
    alertBannerActive: false,
    alertBanner: {
      tag: 'Thank you',
      url: 'https://hashiconf.com/europe',
      text: 'HashiConf Europe is a wrap. Watch this year’s sessions on-demand.',
      linkText: 'Watch Now',
      expirationDate: `2021-06-20T12:00:00-07:00`,
    },
    version: evalDataFile(path.join(repoDirs.data, 'version.js')),
    subnavItems: evalDataFile(path.join(repoDirs.data, 'subnav.js')),
  }
  // write product data to file
  await exec(`rm -rf ./src/data/${slug}.json`)
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
    // docs page
    '@hashicorp/react-sentinel-embedded',
    '@hashicorp/mktg-logos',
    '@hashicorp/react-inline-svg',
    'formik',
    '@hashicorp/react-button',
    '@hashicorp/react-checkbox-input',
    '@hashicorp/react-text-input',
    'unist-util-visit@2',
  ]
  console.log('⏳ Installing dependencies...')
  // await exec(`npm i ${npmDependencies.join(' ')}`)
  console.log('✅ Done')
  //
  // UTILITIES
  //
  // copy remark-sentinel into lib folder
  const srcPath = `${repoDirs.root}/plugins/remark-sentinel.js`
  const destPath = `${destDirs.lib}/remark-sentinel.js`
  await exec(`cp ${srcPath} ${destPath}`)
  //
  // GLOBAL STYLES
  //
  // add the homepage stylesheet to our main style.css
  const missingStylesheets = [
    '../components/_proxied-dot-io/sentinel/Footer/style.css',
    '../components/_proxied-dot-io/sentinel/NewsletterSignupForm/style.css',
  ]
  await addGlobalStyles({ missingStylesheets, productName: productData.name })
  //
  // COMPONENTS
  //
  // copy components into dedicated directory
  const missingComponents = ['Footer', 'NewsletterSignupForm', 'subnav']
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${repoDirs.components}/${missingComponents[i]}`
    const destPath = `${destDirs.components}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  // fix import path in Footer, and fix duplicate g-footer className
  await editFile(`${destDirs.components}/Footer/index.js`, (contents) => {
    return contents
      .replace(
        /from 'components\//g,
        `from 'components/_proxied-dot-io/${productData.slug}/`
      )
      .replace('g-footer', 'g-footer_sentinel')
  })
  await editFile(`${destDirs.components}/Footer/style.css`, (contents) => {
    return contents.replace('g-footer', 'g-footer_sentinel')
  })
  //
  // PAGES
  //
  // delete some page files we don't need
  const filesToDelete = [
    '_app.js',
    '_document.js',
    '_error.jsx',
    'jsconfig.json',
    '404',
    'style.css',
    'sentinel/changelog.mdx',
    'index.jsx',
  ]
  for (let i = 0; i < filesToDelete.length; i++) {
    const filepath = path.join(destDirs.pages, filesToDelete[i])
    await exec(`rm -rf ${filepath}`)
  }
  //
  // LAYOUT
  //
  // edit the subnav file to use the consolidated data file
  await editFile(`${destDirs.components}/subnav/index.jsx`, (contents) => {
    return contents
      .replace(
        "import subnavItems from 'data/subnav'\n",
        "import productData from 'data/sentinel'\n"
      )
      .replace(/subnavItems/g, 'productData.subnavItems')
  })
  // setup the layout file for this product
  await setupIoLayout({ layoutDir: destDirs.layouts, productData })
  //
  // DOCS
  //
  let additionalImports = ''
  additionalImports += `import SentinelEmbedded from '@hashicorp/react-sentinel-embedded'\n`
  additionalImports += `import remarkSentinel from 'lib/remark-sentinel'\n`
  const additionalComponents = '{ SentinelEmbedded }'
  // delete existing docs page
  await exec(
    `rm -f ${path.join(destDirs.pages, 'sentinel', '[[...page]].jsx')}`
  )
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'sentinel',
    productData,
    additionalComponentImports: additionalImports,
    additionalComponents,
  })
  // add unique remarkSentinel setting to config
  await editFile(
    path.join(destDirs.pages, 'sentinel', '[[...page]].tsx'),
    (fileString) =>
      fileString.replace(
        /product: productData\.slug,/g,
        'product: productData.slug,\n        remarkSentinel: [remarkSentinel],'
      )
  )
  //
  // DOWNLOADS PAGE
  //
  await editFile(
    `${destDirs.pages}/sentinel/downloads/index.jsx`,
    (contents) => {
      let newContents = contents
        .replace(
          "import VERSION from '../../../data/version'",
          "import productData from 'data/boundary'"
        )
        .replace(
          'latestVersion: VERSION,',
          'latestVersion: productData.version,'
        )
      newContents = addProxyLayout(newContents, 'DownloadsPage', productData)
      return newContents
    }
  )
}
