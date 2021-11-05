const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const {
  addProxyLayout,
  editFile,
  patchSubnav,
  setupDocsRoute,
  setupProductMigration,
  setupSecurityPage,
} = require('./_shared')

migrateWaypointIo()

async function migrateWaypointIo() {
  const productData = {
    name: 'Waypoint',
    slug: 'waypoint',
    version: '0.5.2',
    metadata: {
      title: 'Waypoint by HashiCorp',
      description:
        'Waypoint is  an open source solution that provides a modern workflow for build, deploy, and release across platforms.',
      image: '/waypoint/img/og-image.png',
      icon: [{ href: '/waypoint/_favicon.ico' }],
    },
    packageManagers: [
      {
        label: 'Homebrew',
        commands: [
          'brew tap hashicorp/tap',
          'brew install hashicorp/tap/waypoint',
        ],
        os: 'darwin',
      },
      {
        label: 'Ubuntu/Debian',
        commands: [
          'curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -',
          "sudo apt-add-repository 'deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main'",
          'sudo apt-get update && sudo apt-get install waypoint',
        ],
        os: 'linux',
      },
      {
        label: 'CentOS/RHEL',
        commands: [
          'sudo yum install -y yum-utils',
          'sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo',
          'sudo yum -y install waypoint',
        ],
        os: 'linux',
      },
      {
        label: 'Fedora',
        commands: [
          'sudo dnf install -y dnf-plugins-core',
          'sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo',
          'sudo dnf -y install waypoint',
        ],
        os: 'linux',
      },
      {
        label: 'Amazon Linux',
        commands: [
          'sudo yum install -y yum-utils',
          'sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo',
          'sudo yum -y install waypoint',
        ],
        os: 'linux',
      },
    ],
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
  // NOTE: none missing at the moment since Waypoint
  // has already been manually migrated
  // const missingDependencies = []
  // console.log('⏳ Installing dependencies...')
  // await exec(`npm i ${missingDependencies.join(' ')}`)
  // console.log('✅ Done')
  //
  // LIB FILES
  //
  const libHooks = path.join(destDirs.lib, 'hooks')
  if (!fs.existsSync(libHooks)) fs.mkdirSync(libHooks, { recursive: true })
  await exec(
    `cp -r ${repoDirs.lib}/hooks/usePrefersReducedMotion.js ${destDirs.lib}/hooks/usePrefersReducedMotion.js`
  )
  await exec(
    `cp -r ${repoDirs.lib}/hooks/useWaypointServiceStatus.js ${destDirs.lib}/hooks/useWaypointServiceStatus.js`
  )

  //
  // COMPONENTS
  //
  // copy components into dedicated directory
  const missingComponents = [
    'homepage',
    'typical',
    'footer',
    'subnav',
    'placement-table',
    'nested-node',
  ]
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${repoDirs.components}/${missingComponents[i]}`
    const destPath = `${destDirs.components}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  // temporary fix for currentPath highlighting issue in subnav
  // TODO there must be a better way to do this?
  await patchSubnav(`${destDirs.components}/subnav/index.jsx`)
  // home page components
  const componentsThatNeedImportPathUpdates = [
    'homepage/features/index.tsx',
    'homepage/sections/extend-plugins/index.tsx',
    'homepage/sections/how-it-works/build-and-deploy/index.tsx',
    'homepage/sections/how-it-works/configure-your-app/index.tsx',
    'homepage/sections/how-it-works/monitor-and-manage/index.tsx',
    'homepage/sections/intro/index.tsx',
    'homepage/sections/monitor-app-health/index.tsx',
    'homepage/sections/workflow-that-scales/index.tsx',
  ]
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
    '/_favicon.ico',
    '/img/og-image.png',
    // press kit
    // note: we have a redirect in place to allow consistent URL
    '/files/press-kit.zip',
    // hero images
    '/img/prebuilt-binaries.svg',
    '/img/deploys-kubernetes-helm.svg',
    '/img/first-party-aws-docker.svg',
    '/img/extensible-plugins.svg',
  ]
  for (let i = 0; i < assetsToCopy.length; i++) {
    const srcPath = `${repoDirs.public}/${assetsToCopy[i]}`
    const destPath = `${destDirs.public}/${assetsToCopy[i]}`
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    await exec(`cp -r ${srcPath} ${destPath}`)
  }
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
  // edit the subnav file to use the above data files
  await editFile(`${destDirs.components}/subnav/index.jsx`, (contents) => {
    return contents.replace(/from 'data/g, "from '../data")
  })
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
    // replace style import path
    newContents = newContents.replace(
      './style.module.css',
      './home/style.module.css'
    )
    // add Boundary .io layout
    newContents = addProxyLayout(newContents, 'HomePage', productData)
    // return
    return newContents
  })
  //
  // DOCS VIEWS
  //
  const componentsPath = destDirs.components.replace('src/', '')
  const additionalComponentImports = `import Placement from '${componentsPath}/placement-table'\nimport NestedNode from '${componentsPath}/nested-node'\n`
  const additionalComponents = '{ Placement, NestedNode }'
  // delete existing docs page
  await exec(`rm -f ${path.join(destDirs.pages, 'docs', '[[...page]].jsx')}`)
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'docs',
    productData,
    additionalComponentImports,
    additionalComponents,
  })
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a standardized template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })
}
