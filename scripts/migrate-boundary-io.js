const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

/*

NOTE: ADDITIONAL MANUAL STEPS

- set up layout in ./src/layouts/_proxied-dot-io/boundary
- copy head metadata from cloned _app.js into ./src/layouts/_proxied-dot-io/boundary/head-metadata.json

*/

// const srcViewsDir = './src/views'
const srcPublicDir = './public'
const srcPagesDir = './src/pages'
const srcComponentsDir = './src/components'
const ioPathBase = '_proxied-dot-io'

migrateBoundaryIo()

async function migrateBoundaryIo() {
  // specify a temporary dir we'll clone into and migrate from
  const clonedDir = '_temp-migrate-boundary-io'
  // specify other directories we'll use
  const pagesDir = path.join(srcPagesDir, ioPathBase, 'boundary')
  const componentsDir = path.join(srcComponentsDir, ioPathBase, 'boundary')
  const publicDir = path.join(srcPublicDir, ioPathBase, 'boundary')

  // clean up from any previous migration attempts
  console.log('⏳ Cleaning up previous migration attempt...')
  const dirsToDelete = [
    // clonedDir,
    pagesDir,
    componentsDir,
    publicDir,
  ]
  for (let i = 0; i < dirsToDelete.length; i++) {
    if (dirsToDelete[i] && dirsToDelete[i].length > 1) {
      await exec(`rm -rf ${dirsToDelete[i]}`)
    }
  }
  const filesToReset = [
    './src/pages/style.css',
    'package.json',
    'package-lock.json',
  ]
  for (let i = 0; i < filesToReset.length; i++) {
    await exec(`git checkout main ${filesToReset[i]}`)
  }
  console.log('✅ Done')
  // set up directories
  fs.mkdirSync(pagesDir, { recursive: true })
  fs.mkdirSync(componentsDir, { recursive: true })
  fs.mkdirSync(path.join(publicDir, 'img'), { recursive: true })

  // clone the boundary repo into a temporary folder
  console.log('⏳ Cloning hashicorp/boundary...')
  await exec(`git clone https://github.com/hashicorp/boundary.git ${clonedDir}`)
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
  // DEPENDENCIES
  //
  // install dependencies required for proxied pages
  const npmDependencies = [
    // home page
    '@hashicorp/react-hero',
    '@hashicorp/react-product-features-list',
    '@hashicorp/react-use-cases',
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
  ]
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${clonedComponents}/${missingComponents[i]}`
    const destPath = `${componentsDir}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  //
  // ASSETS
  //
  await exec(`cp ${clonedPublic}/_favicon.ico ${publicDir}/_favicon.ico`)
  await exec(
    `cp ${clonedPublic}/img/og-image.png ${publicDir}/img/og-image.png`
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
    newContents = newContents.replace(
      'export default function HomePage',
      'function HomePage'
    )
    newContents = `import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'\n${newContents}\nHomePage.layout = BoundaryIoLayout\nexport default HomePage\n`
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
  // TODO: remaining pages
  //
  // clean up: delete the temporary folder
  //   await exec(`rm -rf ${cloneDir}`)
}
async function editFile(filePath, editFn) {
  const contents = fs.readFileSync(filePath, 'utf8')
  const editedContents = await editFn(contents)
  fs.writeFileSync(filePath, editedContents, 'utf8')
}
