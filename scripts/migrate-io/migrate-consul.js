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

migrateConsulIo()

async function migrateConsulIo() {
  const slug = 'consul'

  // set up the source direction (cloned product repository)
  // and the destination directories (all within this project's source)
  const { repoDirs, destDirs } = await setupProductMigration(slug)

  const productData = {
    name: 'Consul',
    slug,
    algoliaConfig: {
      indexName: 'product_CONSUL',
      searchOnlyApiKey: 'fbd5dc1f0078d41509fcc560386fd534',
    },
    analyticsConfig: {
      includedDomains: 'consul.io www.consul.io',
      segmentWriteKey: 'IyzLrqXkox5KJ8XL4fo8vTYNGfiKlTCm',
    },
    datoToken: '88b4984480dad56295a8aadae6caad',
    metadata: {
      title: 'Consul by HashiCorp',
      description:
        'Consul is a service networking solution to automate network configurations, discover services, and enable secure connectivity across any cloud or runtime.',
      image: '/consul/img/og-image.png',
      icon: [{ href: '/consul/_favicon.ico' }],
    },
    alertBannerActive: false,
    alertBanner: evalDataFile(path.join(repoDirs.data, 'alert-banner.js')),
    version: evalDataFile(path.join(repoDirs.data, 'version.js')),
    subnavItems: [],
  }

  // write product data to file
  await exec(`rm -rf ./src/data/${productData.slug}.json`)
  fs.writeFileSync(
    `./src/data/${productData.slug}.json`,
    JSON.stringify(productData, null, 2) + '\n',
    'utf8'
  )

  //
  // PAGES FOLDER SETUP
  //
  // delete some page files we don't need
  const filesToDelete = [
    '_app.js',
    '_document.js',
    '_error.jsx',
    'jsconfig.json',
    '404.jsx',
    'print.css',
    'style.css',
    'index.jsx',
  ]
  for (let i = 0; i < filesToDelete.length; i++) {
    const filepath = path.join(destDirs.pages, filesToDelete[i])
    await exec(`rm -f ${filepath}`)
  }
  //
  // DEPENDENCIES
  //
  // install dependencies required for proxied pages
  const missingDependencies = [
    '@hashicorp/react-text-splits',
    '@hashicorp/react-featured-slider',
  ]
  console.log('⏳ Installing dependencies...')
  // await exec(`npm i ${missingDependencies.join(' ')}`)
  console.log('✅ Done')
  //
  // LIB FILES
  //

  //
  // COMPONENTS
  //
  // copy components into dedicated directory
  const missingComponents = [
    'subnav',
    'footer',
    'homepage-hero',
    'consul-on-kubernetes-hero',
    'features-list',
    'block-list',
    'side-by-side',
    'card-list',
    'docs-list',
    'downloads-props',
  ]
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${repoDirs.components}/${missingComponents[i]}`
    const destPath = `${destDirs.components}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  await editFile(
    `${destDirs.components}/downloads-props/index.jsx`,
    (contents) => {
      return contents.replace(
        `'../../pages/downloads/style.module.css'`,
        `'pages/_proxied-dot-io/consul/downloads/style.module.css'`
      )
    }
  )

  await patchSubnav(`${destDirs.components}/subnav/index.jsx`)
  // home page components
  const componentsThatNeedImportPathUpdates = []
  await Promise.all(
    componentsThatNeedImportPathUpdates.map(async (componentPath) => {
      const filePath = `${destDirs.components}/${componentPath}`
      await editFile(filePath, (contents) => {
        return contents.replace(
          /from 'components\//g,
          `from 'components/_proxied-dot-io/${productData.slug}/`
        )
      })
      return true
    })
  )
  //
  // ASSETS
  //
  const assetsToCopy = [
    // meta images
    // '/img/favicons/favicon.ico', NOTE: actually a Consul favicon
    // Favicon has been manually added as _consul-favicon.ico in public folder
    '/img/og-image.png',
    // press kit
    // note: we have a redirect in place to allow consistent URL
    '/files/press-kit.zip',
    '/img/practice-pattern.svg',
    '/img/home-hero-pattern.svg',
    '/img/usecase-hero-pattern.svg',
    '/img/usecase-callout-pattern.svg',
    '/img/consul-on-kubernetes-share-image.png',
  ]
  for (let i = 0; i < assetsToCopy.length; i++) {
    const srcPath = path.join(repoDirs.public, assetsToCopy[i])
    const destPath = path.join(destDirs.public, assetsToCopy[i])
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    await exec(`cp -r ${srcPath} ${destPath}`)
  }
  //
  // LAYOUT
  //
  // setup the layout file for this product
  await setupIoLayout({ layoutDir: destDirs.layouts, productData })
  await exec(
    `cp _temp-migrations-assets/consul/layouts-index.tsx ${destDirs.layouts}/index.tsx`
  )
  await exec(
    `cp _temp-migrations-assets/consul/layouts-query.graphql ${destDirs.layouts}/query.graphql`
  )
  //
  // HOME PAGE
  //
  // move home page from /home/index.jsx to /index.jsx,
  // to avoid duplicate route (or need for redirect)
  await exec(`mv ${destDirs.pages}/home/index.tsx ${destDirs.pages}/index.tsx`)
  // edit file to account for above changes
  await editFile(`${destDirs.pages}/index.tsx`, (contents) => {
    let newContents = contents
    // replace component import paths
    newContents = newContents.replace(
      /from 'components\//g,
      `from 'components/_proxied-dot-io/${productData.slug}/`
    )
    newContents = newContents.replace(/consul\/io/g, `common/io`)
    // replace require import paths
    newContents = newContents.replace(
      /require\('components\//g,
      `require('components/_proxied-dot-io/${productData.slug}/`
    )
    // replace image asset paths
    newContents = newContents.replace(
      /src: '\/img/g,
      `src: '/${productData.slug}/img`
    )
    newContents = newContents.replace(/\/img/g, `/${productData.slug}/img`)
    // replace style import path
    newContents = newContents.replace(
      './style.module.css',
      './home/style.module.css'
    )
    // replace graphql import path
    newContents = newContents.replace('./query.graphql', './home/query.graphql')
    newContents = newContents.replace(
      /require\('\.\/img/g,
      "require('./home/img"
    )
    newContents = newContents.replace(
      "import RAW_CONTENT from './content.json'",
      "import RAW_CONTENT from './home/content.json'"
    )
    newContents = newContents.replace(
      "import BeforeAfterDiagram from '../../components/before-after-diagram'",
      `import BeforeAfterDiagram from 'components/_proxied-dot-io/${productData.slug}/before-after-diagram'`
    )
    newContents = newContents.replace(
      `import rivetQuery from '@hashicorp/platform-cms'`,
      `import { proxiedRivetClient } from 'lib/cms'`
    )
    newContents = newContents.replace(
      `const { consulHomepage } = await rivetQuery({`,
      `const query = proxiedRivetClient('consul')\n  const { consulHomepage } = await query({`
    )
    newContents = newContents.replace(
      /^\s*isInternalLink=\{isInternalLink\}\n/gm,
      ''
    )
    newContents = newContents.replace(
      `import { isInternalLink } from 'lib/utils'\n`,
      ''
    )
    // add .io layout
    newContents = addProxyLayout(newContents, 'Homepage', productData)
    // return
    return newContents
  })
  //
  // USE CASES
  //
  await editFile(`${destDirs.pages}/use-cases/[slug].tsx`, (contents) => {
    let newContents = contents
    // replace component import paths
    newContents = newContents.replace(
      /from 'components\//g,
      `from 'components/_proxied-dot-io/${productData.slug}/`
    )
    newContents = newContents.replace(/consul\/io/g, `common/io`)
    // replace require import paths
    newContents = newContents.replace(
      /require\('components\//g,
      `require('components/_proxied-dot-io/${productData.slug}/`
    )
    // replace image asset paths
    newContents = newContents.replace(
      /src: '\/img/g,
      `src: '/${productData.slug}/img`
    )
    newContents = newContents.replace(/\/img/g, `/${productData.slug}/img`)
    // add .io layout
    newContents = addProxyLayout(newContents, 'UseCasePage', productData)
    // update rivet query
    newContents = newContents.replace(
      `import rivetQuery from '@hashicorp/platform-cms'`,
      `import { proxiedRivetClient } from 'lib/cms'`
    )
    newContents = newContents.replace(
      /const \{ allConsulUseCases \} = await rivetQuery/g,
      `const query = proxiedRivetClient('${productData.slug}')\n  const { allConsulUseCases } = await query`
    )

    // return
    return newContents
  })
  //
  // CONSUL ON KUBERNETES
  //
  await editFile(
    `${destDirs.pages}/consul-on-kubernetes/index.tsx`,
    (contents) => {
      let newContents = contents
      // replace component import paths
      newContents = newContents.replace(
        /from 'components\//g,
        `from 'components/_proxied-dot-io/${productData.slug}/`
      )
      // replace image asset paths
      newContents = newContents.replace(
        /src: '\/img/g,
        `src: '/${productData.slug}/img`
      )
      newContents = newContents.replace(/\/img/g, `/${productData.slug}/img`)
      // add .io layout
      newContents = addProxyLayout(
        newContents,
        'ConsulOnKubernetesPage',
        productData
      )

      // return
      return newContents
    }
  )
  //
  // DOCS
  //
  const componentsPath = destDirs.components.replace('src/', '')
  const additionalComponentImports = ``
  const additionalComponents = '{}'
  // delete existing docs page
  await exec(
    `rm -f ${path.join(destDirs.pages, 'docs', '\\[\\[...page\\]\\].jsx')}`
  )
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'docs',
    productData,
    additionalComponentImports,
    additionalComponents,
  })
  //
  // API DOCS
  //
  // delete existing docs page
  await exec(
    `rm -f ${path.join(destDirs.pages, 'api-docs', '\\[\\[...page\\]\\].jsx')}`
  )
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'api-docs',
    productData,
  })
  //
  // COMMANDS
  //
  // delete existing docs page
  await exec(
    `rm -f ${path.join(destDirs.pages, 'commands', '\\[\\[...page\\]\\].jsx')}`
  )
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'commands',
    productData,
  })
  //
  // COMMUNITY
  //
  await editFile(`${destDirs.pages}/community/index.jsx`, (contents) => {
    let newContents = addProxyLayout(contents, 'CommunityPage', productData)
    newContents = newContents.replace(
      'product={productSlug}',
      'product="consul"'
    )
    newContents = newContents.replace(
      `import { productSlug } from 'data/metadata'\n`,
      ''
    )
    return newContents
  })
  //
  // DOWNLOADS
  //
  await exec(
    `cp _temp-migrations-assets/consul/downloads-index.jsx ${destDirs.pages}/downloads/index.jsx`
  )
  await exec(
    `cp _temp-migrations-assets/consul/downloads-enterprise.jsx ${destDirs.pages}/downloads/enterprise.jsx`
  )
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a standardized template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await exec(`rm -f ${path.join(destDirs.pages, 'security.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })

  //
  // GLOBAL STYLES
  //
  // add the homepage stylesheet to our main style.css
  const missingStylesheets = [
    '../components/_proxied-dot-io/consul/footer/style.css',
  ]
  await addGlobalStyles({ missingStylesheets, productName: productData.name })
}
