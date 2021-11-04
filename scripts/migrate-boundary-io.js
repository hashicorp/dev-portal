const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

/*

NOTE: ADDITIONAL MANUAL STEPS

- set up layout in ./src/layouts/_proxied-dot-io/boundary

*/

const srcPublicDir = 'public'
const srcPagesDir = 'src/pages'
const srcComponentsDir = 'src/components'
const ioPathBase = '_proxied-dot-io'

migrateBoundaryIo()

async function migrateBoundaryIo() {
  // specify a temporary dir we'll clone into and migrate from
  const clonedDir = '_temp-migrate-boundary-io'
  // specify other directories we'll use
  const pagesDir = path.join(srcPagesDir, ioPathBase, 'boundary')
  const componentsDir = path.join(srcComponentsDir, ioPathBase, 'boundary')
  const publicDir = path.join(srcPublicDir, 'boundary')

  // clean up from any previous migration attempts
  console.log('⏳ Cleaning up previous migration attempt...')
  const dirsToDelete = [
    // clonedDir,
    pagesDir,
    componentsDir,
    publicDir,
    // './data/boundary.json',
  ]
  for (let i = 0; i < dirsToDelete.length; i++) {
    if (dirsToDelete[i] && dirsToDelete[i].length > 1) {
      await exec(`rm -rf ${dirsToDelete[i]}`)
    }
  }
  const filesToReset = [
    './src/pages/style.css',
    // 'package.json',
    // 'package-lock.json',
  ]
  for (let i = 0; i < filesToReset.length; i++) {
    await exec(`git checkout main ${filesToReset[i]}`)
  }
  console.log('✅ Done')
  // set up directories
  fs.mkdirSync(pagesDir, { recursive: true })
  fs.mkdirSync(componentsDir, { recursive: true })
  fs.mkdirSync(path.join(publicDir, 'img'), { recursive: true })
  fs.mkdirSync(path.join(publicDir, 'files'), { recursive: true })

  // clone the boundary repo into a temporary folder
  console.log('⏳ Cloning hashicorp/boundary...')
  if (!fs.existsSync(clonedDir)) {
    await exec(
      `git clone https://github.com/hashicorp/boundary.git ${clonedDir}`
    )
  }
  console.log('✅ Done')
  const clonedWebsite = path.join(clonedDir, 'website')
  const clonedPages = path.join(clonedWebsite, 'pages')
  const clonedComponents = path.join(clonedWebsite, 'components')
  const clonedData = path.join(clonedWebsite, 'data')
  const clonedPublic = path.join(clonedWebsite, 'public')
  // copy all pages from old website into new views dir
  await exec(`cp -r ${clonedPages}/ ${pagesDir}`)
  // delete some files we don't need
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
    const filepath = path.join(pagesDir, filesToDelete[i])
    await exec(`rm -f ${filepath}`)
  }
  //
  // METADATA
  //
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
  fs.writeFileSync(
    `./src/data/boundary.json`,
    JSON.stringify(productData, null, 2) + '\n',
    'utf8'
  )
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
    const srcPath = `${clonedComponents}/${missingComponents[i]}`
    const destPath = `${componentsDir}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  // Update press kit link in footer
  await editFile(`${componentsDir}/footer/index.jsx`, (contents) => {
    return contents.replace(
      '/files/press-kit.zip',
      `${publicDir}/files/press-kit.zip`.replace(srcPublicDir, '')
    )
  })
  //
  // ASSETS
  //
  // Copy favicon and open-graph image into public folder
  await exec(`cp ${clonedPublic}/_favicon.ico ${publicDir}/_favicon.ico`)
  await exec(
    `cp ${clonedPublic}/img/og-image.png ${publicDir}/img/og-image.png`
  )
  // Copy press kit into public folder
  await exec(
    `cp ${clonedPublic}/files/press-kit.zip ${publicDir}/files/press-kit.zip`
  )
  //
  // GLOBAL STYLES
  //
  // add the homepage stylesheet to our main style.css
  const missingStylesheets = [
    './_proxied-dot-io/boundary/home/style.css',
    '../components/_proxied-dot-io/boundary/footer/style.css',
  ]
  const importStatements = missingStylesheets
    .map((cssPath) => {
      return `@import '${cssPath}';`
    })
    .join('\n')
  await editFile('./src/pages/style.css', (contents) => {
    if (contents.indexOf('Proxied boundary.io page') !== -1) return contents
    return contents.replace(
      '/* Print Styles */',
      `/* Proxied boundary.io page styles */\n${importStatements}\n\n/* Print Styles */`
    )
  })
  //
  // LAYOUT
  //
  // copy data files, kinda temporary for now
  fs.mkdirSync(path.join(componentsDir, 'data'), { recursive: true })
  await exec(
    `cp -r ${clonedData}/metadata.js ${componentsDir}/data/metadata.js`
  )
  await exec(
    `cp -r ${clonedData}/navigation.js ${componentsDir}/data/navigation.js`
  )
  await exec(`cp -r ${clonedData}/version.js ${componentsDir}/data/version.js`)
  // edit the subnav file to use the above data files
  await editFile(`${componentsDir}/subnav/index.jsx`, (contents) => {
    return contents.replace(/from 'data/g, "from '../data")
  })
  //
  // HOME PAGE
  //
  // move home page from /home/index.jsx to /index.jsx,
  // to avoid duplicate route (or need for redirect)
  await exec(`mv ${pagesDir}/home/index.jsx ${pagesDir}/index.jsx`)
  // edit file to account for above changes
  await editFile(`${pagesDir}/index.jsx`, (contents) => {
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
    newContents = addProxyLayout(newContents, 'HomePage')
    // return
    return newContents
  })
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a standardized template
  await exec(`rm -f ${path.join(pagesDir, 'security', 'index.jsx')}`)
  // copy template into place
  await exec(
    `cp -r ./scripts/migration-templates/security.tsx ${pagesDir}/security/index.tsx`
  )
  // replace variables in template
  await editFile(`${pagesDir}/security/index.tsx`, (contents) => {
    return contents
      .replace(/\$\$productName/g, 'Boundary')
      .replace(/\$\$layoutName/g, 'BoundaryIoLayout')
      .replace(/\$\$layoutPath/g, 'layouts/_proxied-dot-io/boundary')
      .replace(/\$\$githubUrl/g, 'https://www.github.com/hashicorp/boundary')
  })
  //
  // DOCS PAGE
  // TODO: abstract to docs route more generally
  //
  // delete existing docs page, we'll use a standardized template
  await exec(`rm -f ${path.join(pagesDir, 'docs', '[[...page]].jsx')}`)
  // copy template into place
  await exec(
    `cp -r ./scripts/migration-templates/docs-page.tsx ${pagesDir}/docs/[[...page]].tsx`
  )
  // replace variables in template
  const additionalComponentImports = ''
  const additionalComponents = '{}'
  await editFile(`${pagesDir}/docs/[[...page]].tsx`, (contents) => {
    return contents
      .replace(/\$\$productSlug/g, 'boundary')
      .replace(/\$\$layoutName/g, 'BoundaryIoLayout')
      .replace(/\$\$layoutPath/g, 'layouts/_proxied-dot-io/boundary')
      .replace(/\$\$additionalComponentImports\n/, additionalComponentImports)
      .replace(/\$\$additionalComponents/, additionalComponents)
  })
  //
  // API-DOCS PAGE
  //
  await editFile(`${pagesDir}/api-docs/[[...page]].jsx`, (contents) => {
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
    newContents = addProxyLayout(newContents, 'OpenApiDocsPage')
    return newContents
  })
  //
  // DOWNLOADS PAGE
  //
  await editFile(`${pagesDir}/downloads/index.jsx`, (contents) => {
    let newContents = contents
      .replace(
        /from 'components\//g,
        "from 'components/_proxied-dot-io/boundary/"
      )
      .replace(/from 'data/g, "from 'components/_proxied-dot-io/boundary/data")
    newContents = addProxyLayout(newContents, 'DownloadsPage')
    return newContents
  })
  //
  // COMMUNITY PAGE
  //
  await editFile(`${pagesDir}/community/index.jsx`, (contents) => {
    return addProxyLayout(contents, 'CommunityPage')
  })
  // clean up: delete the temporary folder
  //   await exec(`rm -rf ${cloneDir}`)
}
async function editFile(filePath, editFn) {
  const contents = fs.readFileSync(filePath, 'utf8')
  const editedContents = await editFn(contents)
  fs.writeFileSync(filePath, editedContents, 'utf8')
}

function addProxyLayout(fileString, pageName) {
  const layoutName = 'BoundaryIoLayout'
  const layoutPath = 'layouts/_proxied-dot-io/boundary'
  return `import ${layoutName} from '${layoutPath}'\n${fileString.replace(
    `export default function ${pageName}`,
    `function ${pageName}`
  )}\n${pageName}.layout = ${layoutName}\nexport default ${pageName}\n`
}
