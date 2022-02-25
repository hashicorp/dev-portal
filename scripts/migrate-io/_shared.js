//@ts-check

const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

const TEMP_DIR = '_temp-migrations'
const DEST_PUBLIC = 'public'
const DEST_PAGES = 'src/pages'
const DEST_LAYOUTS = 'src/layouts'
const DEST_COMPONENTS = 'src/components'
const DEST_LIB = 'src/lib'
const IO_BASE_DIR = '_proxied-dot-io'

/**
 * @typedef {Object} RepositoryDirs
 * @property {string} root
 * @property {string} components
 * @property {string} data
 * @property {string} pages
 * @property {string} public
 * @property {string} lib
 */

/**
 * @typedef {Object} DestinationDirs
 * @property {string} pages
 * @property {string} layouts
 * @property {string} components
 * @property {string} lib
 * @property {string} public
 */

/**
 *
 * @param {string} slug
 * @returns {Promise<{ repoDirs: RepositoryDirs, destDirs: DestinationDirs }>}
 */
async function setupProductMigration(slug) {
  if (process.platform !== 'darwin' && process.platform !== 'linux') {
    throw new Error('.io migration scripts only support macOS and Linux')
  }
  //
  // SOURCE - clone repo from GitHub
  //
  // specify a temporary dir we'll clone into and migrate from
  const clonedDir = path.join(TEMP_DIR, slug)
  fs.mkdirSync(TEMP_DIR, { recursive: true })
  // clone the product repository
  const gitCloneUrl = `https://github.com/hashicorp/${slug}.git`
  console.log(`⏳ Cloning hashicorp/${slug}...`)
  if (!fs.existsSync(clonedDir)) {
    // clone with depth of 1 since we don't care about history
    await exec(`git clone --depth 1 ${gitCloneUrl} ${clonedDir}`)
  } else {
    // reset local checkout in the event there are changes
    await exec(`cd ${clonedDir} && git restore .`)
  }
  console.log('✅ Done')

  // set up a repoDirs object, which we'll
  // return so it can be used for product-specific setup
  const clonedWebsite = path.join(clonedDir, 'website')
  const repoDirs = {
    root: clonedWebsite,
    components: path.join(clonedWebsite, 'components'),
    data: path.join(clonedWebsite, 'data'),
    pages: path.join(clonedWebsite, 'pages'),
    public: path.join(clonedWebsite, 'public'),
    lib: path.join(clonedWebsite, 'lib'),
  }
  //
  // DESTINATION - refresh & set up directories
  //
  console.log('⏳ Setting up destination folders...')
  const destDirs = {
    pages: path.join(DEST_PAGES, IO_BASE_DIR, slug),
    layouts: path.join(DEST_LAYOUTS, IO_BASE_DIR, slug),
    components: path.join(DEST_COMPONENTS, IO_BASE_DIR, slug),
    lib: DEST_LIB,
    public: path.join(DEST_PUBLIC, slug),
  }
  // clean up from any previous migration attempts
  const destDirKeys = Object.keys(destDirs)
  for (let i = 0; i < destDirKeys.length; i++) {
    const destDir = destDirs[destDirKeys[i]]
    // remove old directory
    if (destDirKeys[i] !== 'lib') {
      await exec(`rm -rf ./${destDir}`)
    }
    // set up directories
    fs.mkdirSync(destDir, { recursive: true })
  }
  // copy all repo pages into this repo's pages dir
  // (we'll remove some of these files on a product-by-product basis)
  if (process.platform === 'darwin') {
    await exec(`cp -r ${repoDirs.pages}/ ${destDirs.pages}`)
  } else {
    await exec(`cp -r ${repoDirs.pages}/. ${destDirs.pages}`)
  }
  console.log('✅ Done')
  // TODO
  // TODO more setup stuff
  // TODO
  return { repoDirs, destDirs }
}

/**
 *
 * @param {Object} params
 * @param {string} params.pagesDir
 * @param {string} params.basePath
 * @param {{ slug: string, name: string }} params.productData
 * @param {string=} params.additionalComponentImports
 * @param {string=} params.additionalComponents
 * @returns {Promise<boolean>}
 */
async function setupDocsRoute({
  pagesDir,
  basePath,
  productData,
  additionalComponentImports = '',
  additionalComponents = '{}',
}) {
  const { slug, name } = productData
  // copy template into place
  const templateFile = './scripts/migrate-io/templates/docs-page.tsx'
  await exec(
    `cp -r ${templateFile} ${pagesDir}/${basePath}/\\[\\[...page\\]\\].tsx`
  )
  // replace variables in template
  await editFile(`${pagesDir}/${basePath}/[[...page]].tsx`, (contents) => {
    return contents
      .replace(/\$\$productSlug/g, slug)
      .replace(/\$\$layoutName/g, `${name}IoLayout`)
      .replace(/\$\$basePath/g, basePath)
      .replace(/\$\$layoutPath/g, `layouts/_proxied-dot-io/${slug}`)
      .replace(/\$\$additionalComponentImports\n/, additionalComponentImports)
      .replace(/\$\$additionalComponents/, additionalComponents)
  })
  //
  return true
}

/**
 *
 * @param {Object} params
 * @param {string} params.layoutDir
 * @param {{ slug: string, name: string }} params.productData
 * @returns {Promise<boolean>}
 */
async function setupIoLayout({ layoutDir, productData }) {
  const { slug, name } = productData
  // copy template into place
  const templateFile = './scripts/migrate-io/templates/layout.tsx'
  await exec(`cp -r ${templateFile} ${layoutDir}/index.tsx`)
  // replace variables in template
  await editFile(`${layoutDir}/index.tsx`, (contents) => {
    return contents
      .replace(/\$\$productSlug/g, slug)
      .replace(/\$\$productName/g, name)
  })
  return true
}

/**
 *
 * @param {Object} params
 * @param {string} params.pagesDir
 * @param {{ slug: string, name: string }} params.productData
 * @returns {Promise<void>}
 */
async function setupSecurityPage({ pagesDir, productData }) {
  const { name, slug } = productData
  fs.mkdirSync(path.join(pagesDir, 'security'), { recursive: true })
  // copy template into place
  await exec(
    `cp -r ./scripts/migrate-io/templates/security.tsx ${pagesDir}/security/index.tsx`
  )
  // replace variables in template
  await editFile(`${pagesDir}/security/index.tsx`, (contents) => {
    return contents
      .replace(/\$\$productName/g, name)
      .replace(/\$\$layoutName/g, `${name}IoLayout`)
      .replace(/\$\$layoutPath/g, `layouts/_proxied-dot-io/${slug}`)
      .replace(/\$\$githubUrl/g, `https://www.github.com/hashicorp/${slug}`)
  })
}

/**
 *
 * @param {Object} params
 * @param {string} params.pageFilePath
 * @param {{ slug: string, name: string }} params.productData
 * @param {string} params.localFilePath
 * @param {string} params.remoteFilePath
 * @param {string} params.remoteVersion
 */
async function setupMarkdownPage({
  pageFilePath,
  productData,
  localFilePath,
  remoteFilePath,
  remoteVersion,
}) {
  const { name, slug } = productData
  // copy template into place
  await exec(
    `rm -f ${pageFilePath} && cp ./scripts/migrate-io/templates/markdown-page.jsx ${pageFilePath}`
  )
  // replace variables in template
  await editFile(pageFilePath, (contents) => {
    return contents
      .replace(/\$\$productSlug/g, slug)
      .replace(/\$\$localFilePath/g, localFilePath)
      .replace(/\$\$remoteFilePath/g, remoteFilePath)
      .replace(/\$\$remoteVersion/g, remoteVersion)
      .replace(/\$\$layoutName/g, `${name}IoLayout`)
      .replace(/\$\$layoutPath/g, `layouts/_proxied-dot-io/${slug}`)
  })
}

/**
 *
 * @param {string} fileString
 * @param {string} pageName
 * @param {{ slug: string, name: string }} productData
 * @returns {string}
 */
function addProxyLayout(fileString, pageName, productData) {
  const { name, slug } = productData
  const layoutName = `${name}IoLayout`
  const layoutPath = `layouts/_proxied-dot-io/${slug}`
  return `import ${layoutName} from '${layoutPath}'\n${fileString
    .replace(`export default function ${pageName}`, `function ${pageName}`)
    .replace(
      `export default ${pageName}`,
      ''
    )}\n${pageName}.layout = ${layoutName}\nexport default ${pageName}\n`
}

/**
 *
 * @param {string} filePath
 * @param {(s: string) => (Promise<string> | string)} editFn
 */
async function editFile(filePath, editFn) {
  const contents = fs.readFileSync(filePath, 'utf8')
  const editedContents = await editFn(contents)
  fs.writeFileSync(filePath, editedContents, 'utf8')
}

/**
 *
 * @param {Object} params
 * @param {string[]} params.missingStylesheets
 * @param {string} params.productName
 * @returns {Promise<void>}
 */
async function addGlobalStyles({ missingStylesheets, productName }) {
  const importStatements = missingStylesheets
    .map((cssPath) => `@import '${cssPath}';`)
    .join('\n')
  await editFile('./src/pages/style.css', (contents) => {
    const identifyingComment = `Proxied ${productName} page styles`
    if (contents.indexOf(identifyingComment) !== -1) return contents
    return contents.replace(
      '/* Print Styles */',
      `/* ${identifyingComment} */\n${importStatements}\n\n/* Print Styles */`
    )
  })
}

/**
 *
 * @param {string} filepath
 * @returns {Promise<void>}
 */
async function patchSubnav(filepath) {
  await editFile(filepath, (contents) => {
    return (
      `import { useEffect, useState } from 'react'\n` +
      contents
        .replace('router.asPath', 'currentPath')
        .replace(
          'const router = useRouter()',
          'const router = useRouter()\n  const [currentPath, setCurrentPath] = useState()\n\n  useEffect(() => {\n    setCurrentPath(router.asPath)\n  }, [router.asPath])\n'
        )
    )
  })
}

/**
 * Given the full path to data file,
 * return the eval()'d file contents.
 *
 * Warning: this is quite brittle.
 * Naively replaces ES6 export statements
 * for slightly better compatibility.
 *
 * @param {string} filePath
 * @returns {unknown}
 */
function evalDataFile(filePath) {
  const fileString = fs.readFileSync(filePath, 'utf-8')
  return eval(
    fileString
      .replace('export default ', 'module.exports = ')
      .replace('export const', 'const')
  )
}

module.exports = {
  addGlobalStyles,
  addProxyLayout,
  editFile,
  evalDataFile,
  patchSubnav,
  setupDocsRoute,
  setupIoLayout,
  setupProductMigration,
  setupSecurityPage,
  setupMarkdownPage,
}
