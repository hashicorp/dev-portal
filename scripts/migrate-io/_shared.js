const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

const TEMP_DIR = '_temp-migrations'
const DEST_PUBLIC = 'public'
const DEST_PAGES = 'src/pages'
const DEST_COMPONENTS = 'src/components'
const DEST_LIB = 'src/lib'
const IO_BASE_DIR = '_proxied-dot-io'

async function setupProductMigration(productData) {
  const { slug } = productData
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
    const cloneCommand = `git clone ${gitCloneUrl} ${clonedDir}`
    console.log({ cloneCommand })
    await exec(cloneCommand)
  }
  console.log('✅ Done')
  // set up product data file
  await exec(`rm -rf ./src/data/${slug}.json`)
  fs.writeFileSync(
    `./src/data/${slug}.json`,
    JSON.stringify(productData, null, 2) + '\n',
    'utf8'
  )
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
    components: path.join(DEST_COMPONENTS, IO_BASE_DIR, slug),
    lib: DEST_LIB,
    public: path.join(DEST_PUBLIC, slug),
  }
  // clean up from any previous migration attempts
  const destDirValues = Object.values(destDirs)
  for (let i = 0; i < destDirValues.length; i++) {
    // remove old directory
    await exec(`rm -rf ./${destDirValues[i]}`)
    // set up directories
    fs.mkdirSync(destDirValues[i], { recursive: true })
  }
  // copy all repo pages into this repo's pages dir
  // (we'll remove some of these files on a product-by-product basis)
  await exec(`cp -r ${repoDirs.pages}/ ${destDirs.pages}`)
  console.log('✅ Done')
  // TODO
  // TODO more setup stuff
  // TODO
  return { repoDirs, destDirs }
}

async function setupDocsRoute({
  pagesDir,
  basePath,
  productData,
  additionalComponentImports,
  additionalComponents,
}) {
  const { slug, name } = productData
  // copy template into place
  const templateFile = './scripts/migrate-io/templates/docs-page.tsx'
  await exec(`cp -r ${templateFile} ${pagesDir}/${basePath}/[[...page]].tsx`)
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

async function setupSecurityPage({ pagesDir, productData }) {
  const { name, slug } = productData
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

function addProxyLayout(fileString, pageName, productData) {
  const { name, slug } = productData
  const layoutName = `${name}IoLayout`
  const layoutPath = `layouts/_proxied-dot-io/${slug}`
  return `import ${layoutName} from '${layoutPath}'\n${fileString.replace(
    `export default function ${pageName}`,
    `function ${pageName}`
  )}\n${pageName}.layout = ${layoutName}\nexport default ${pageName}\n`
}

async function editFile(filePath, editFn) {
  const contents = fs.readFileSync(filePath, 'utf8')
  const editedContents = await editFn(contents)
  fs.writeFileSync(filePath, editedContents, 'utf8')
}

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

module.exports = {
  addGlobalStyles,
  addProxyLayout,
  editFile,
  patchSubnav,
  setupDocsRoute,
  setupProductMigration,
  setupSecurityPage,
}
