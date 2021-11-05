const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const {
  addGlobalStyles,
  addProxyLayout,
  editFile,
  patchSubnav,
  setupDocsRoute,
  setupProductMigration,
  setupSecurityPage,
} = require('./_shared')

/*

NOTE: ADDITIONAL MANUAL STEPS

- set up layout in ./src/layouts/_proxied-dot-io/boundary

*/

migrateBoundaryIo()

async function migrateBoundaryIo() {
  const productData = {
    name: 'Boundary',
    slug: 'boundary',
    metadata: {
      title: 'Boundary by HashiCorp',
      description:
        'Boundary is an open source solution that automates a secure identity-based user access to hosts and services across environments.',
      image: '/boundary/img/og-image.png',
      icon: [{ href: '/boundary/_favicon.ico' }],
    },
  }
  // set up the source direction (cloned product repository)
  // and the destination directories (all within this project's source)
  const { repoDirs, destDirs } = await setupProductMigration(productData)
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
  const npmDependencies = [
    // home page
    '@hashicorp/react-hero',
    '@hashicorp/react-open-api-page',
    '@hashicorp/react-product-features-list',
    '@hashicorp/react-use-cases',
    '@octokit/core',
    '@octokit/openapi-types',
  ]
  console.log('⏳ Installing dependencies...')
  // await exec(`npm i ${npmDependencies.join(' ')}`)
  console.log('✅ Done')
  //
  // COMPONENTS
  //
  // copy components into dedicated directory
  const missingComponents = [
    'footer',
    'subnav',
    'branded-cta',
    'homepage-hero',
    'how-it-works',
    'how-boundary-works',
    'why-boundary',
    'merch-desktop-client',
  ]
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${repoDirs.components}/${missingComponents[i]}`
    const destPath = `${destDirs.components}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  // temporary fix for currentPath highlighting issue in subnav
  // TODO there must be a better way to do this?
  await patchSubnav(`${destDirs.components}/subnav/index.jsx`)
  // replace image path for hero background
  await editFile(
    `${destDirs.components}/homepage-hero/HomepageHero.module.css`,
    (fileString) =>
      fileString.replace(
        '/img/hero-pattern.svg',
        "'/boundary/img/hero-pattern.svg'"
      )
  )
  // replace image path for CTA background
  await editFile(
    `${destDirs.components}/branded-cta/branded-cta.module.css`,
    (fileString) =>
      fileString.replace('/img/cta-bg.svg', '/boundary/img/cta-bg.svg')
  )
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
    // hero images
    '/img/hero-pattern.svg',
    '/img/cta-bg.svg',
  ]
  for (let i = 0; i < assetsToCopy.length; i++) {
    const srcPath = `${repoDirs.public}/${assetsToCopy[i]}`
    const destPath = `${destDirs.public}/${assetsToCopy[i]}`
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    await exec(`cp -r ${srcPath} ${destPath}`)
  }
  //
  // GLOBAL STYLES
  //
  // add the homepage stylesheet to our main style.css
  const missingStylesheets = [
    './_proxied-dot-io/boundary/home/style.css',
    '../components/_proxied-dot-io/boundary/footer/style.css',
  ]
  await addGlobalStyles({ missingStylesheets, productName: productData.name })
  //
  // LAYOUT
  //
  // copy data files, kinda temporary for now
  fs.mkdirSync(path.join(destDirs.components, 'data'), { recursive: true })
  await exec(
    `cp -r ${repoDirs.data}/metadata.js ${destDirs.components}/data/metadata.js`
  )
  await exec(
    `cp -r ${repoDirs.data}/navigation.js ${destDirs.components}/data/navigation.js`
  )
  await exec(
    `cp -r ${repoDirs.data}/version.js ${destDirs.components}/data/version.js`
  )
  // edit the subnav file to use the above data files
  await editFile(`${destDirs.components}/subnav/index.jsx`, (contents) => {
    return contents.replace(/from 'data/g, "from '../data")
  })
  //
  // HOME PAGE
  //
  // move home page from /home/index.jsx to /index.jsx,
  // to avoid duplicate route (or need for redirect)
  await exec(`mv ${destDirs.pages}/home/index.jsx ${destDirs.pages}/index.jsx`)
  // edit file to account for above changes
  await editFile(`${destDirs.pages}/index.jsx`, (contents) => {
    let newContents = contents
    // replace image import paths
    newContents = newContents.replace(
      /require\('\.\/img/g,
      "require('./home/img"
    )
    // replace component import paths
    newContents = newContents.replace(
      /from 'components\//g,
      "from 'components/_proxied-dot-io/boundary/"
    )
    // add Boundary .io layout
    newContents = addProxyLayout(newContents, 'HomePage', productData)
    // return
    return newContents
  })
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a standardized template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })
  //
  // DOCS PAGE
  //
  // delete existing docs page
  await exec(`rm -f ${path.join(destDirs.pages, 'docs', '[[...page]].jsx')}`)
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'docs',
    productData,
  })
  //
  // API-DOCS PAGE
  //
  await editFile(`${destDirs.pages}/api-docs/[[...page]].jsx`, (contents) => {
    let newContents = contents
      .replace(
        "import path from 'path'",
        "import fetchGithubFile from 'lib/fetch-github-file'"
      )
      .replace(
        "'../internal/gen/controller.swagger.json'",
        "{\n  owner: 'hashicorp',\n  repo: 'boundary',\n  path: 'internal/gen/controller.swagger.json',\n}"
      )
      .replace(
        /path\.join\(process\.cwd\(\), targetFile\)/g,
        'await fetchGithubFile(targetFile)'
      )
      .replace(/{productName}/g, '{productData.name}')
      .replace(/{productSlug}/g, '{productData.slug}')
      .replace(
        "import { productName, productSlug } from 'data/metadata'",
        "import productData from 'data/boundary'"
      )
      .replace(/processSchemaFile/g, 'processSchemaString')
    newContents = addProxyLayout(newContents, 'OpenApiDocsPage', productData)
    return newContents
  })
  //
  // DOWNLOADS PAGE
  //
  await editFile(`${destDirs.pages}/downloads/index.jsx`, (contents) => {
    let newContents = contents
      .replace(
        /from 'components\//g,
        "from 'components/_proxied-dot-io/boundary/"
      )
      .replace(/from 'data/g, "from 'components/_proxied-dot-io/boundary/data")
    newContents = addProxyLayout(newContents, 'DownloadsPage', productData)
    return newContents
  })
  //
  // COMMUNITY PAGE
  //
  await editFile(`${destDirs.pages}/community/index.jsx`, (contents) => {
    return addProxyLayout(contents, 'CommunityPage', productData)
  })
  // clean up: delete the temporary folder
  //   await exec(`rm -rf ${cloneDir}`)
}
