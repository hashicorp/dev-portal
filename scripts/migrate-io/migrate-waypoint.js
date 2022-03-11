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
  setupIoLayout,
} = require('./_shared')

migrateWaypointIo()

async function migrateWaypointIo() {
  const productData = {
    name: 'Waypoint',
    slug: 'waypoint',
    version: '0.7.1',
    // TODO: confirm this is a decent place for this info
    algoliaConfig: {
      indexName: 'product_WAYPOINT',
      searchOnlyApiKey: '5e4adfd8094367056501547d6fedb6c5',
    },
    // TODO: automate metadata extraction from _app.js
    // (lower priority, not something that seems to change often)
    metadata: {
      title: 'Waypoint by HashiCorp',
      description:
        'Waypoint is  an open source solution that provides a modern workflow for build, deploy, and release across platforms.',
      image: '/waypoint/img/og-image.png',
      icon: [{ href: '/waypoint/_favicon.ico' }],
    },
    // TODO: parse alertBanner from _app.js
    alertBannerActive: true,
    alertBanner: {
      tag: 'Thank you',
      url: 'https://hashiconf.com/europe',
      text: 'HashiConf Europe is a wrap. Watch this year’s sessions on-demand.',
      linkText: 'Watch Now',
      expirationDate: `2021-06-20T12:00:00-07:00`,
    },
    // TODO: parse subnavItems from navigation.js
    subnavItems: [
      {
        text: 'Overview',
        url: '/',
        type: 'inbound',
      },
      {
        text: 'Tutorials',
        url: 'https://learn.hashicorp.com/waypoint',
        type: 'inbound',
      },
      {
        text: 'Docs',
        url: '/docs',
        type: 'inbound',
      },
      {
        text: 'CLI',
        url: '/commands',
        type: 'inbound',
      },
      {
        text: 'Plugins',
        url: '/plugins',
        type: 'inbound',
      },
      {
        text: 'Community',
        url: '/community',
        type: 'inbound',
      },
    ],
    // TODO: parse from version.js
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
  const { repoDirs, destDirs } = await setupProductMigration(productData.slug)
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
  // fix asset URL path in footer
  await editFile(
    `${destDirs.components}/footer/style.module.css`,
    (contents) => {
      return contents
        .replace(
          'url(/img/status-degraded.svg)',
          "url('/waypoint/img/status-degraded.svg')"
        )
        .replace(
          'url(/img/status-normal.svg)',
          "url('/waypoint/img/status-normal.svg')"
        )
    }
  )

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
    // footer card images
    '/img/get-started-kubernetes.png',
    '/img/intro-to-waypoint.png',
    // footer status icons
    '/img/status-normal.svg',
    '/img/status-degraded.svg',
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
  // edit the subnav file to use the consolidated data file
  await editFile(`${destDirs.components}/subnav/index.jsx`, (contents) => {
    return contents
      .replace(
        "import { productSlug } from 'data/metadata'",
        "import productData from 'data/waypoint'"
      )
      .replace(/productSlug/g, 'productData.slug')
      .replace("import subnavItems from 'data/navigation'\n", '')
      .replace(/subnavItems/g, 'productData.subnavItems')
  })
  // setup a FooterWithProps component
  // TODO
  await exec(`mkdir ./${destDirs.components}/footer-with-props`)
  await exec(`touch ./${destDirs.components}/footer-with-props/index.tsx`)
  const appJsString = fs.readFileSync(`./${repoDirs.pages}/_app.js`, 'utf8')
  const footerJsxString = /<Footer([\S\s]*?)\/>/
    .exec(appJsString)[0]
    .replace(/'\/img/g, "'/waypoint/img")
  await editFile(`${destDirs.components}/footer-with-props/index.tsx`, () => {
    return `import Footer from '${destDirs.components.replace(
      'src/',
      ''
    )}/footer'

function FooterWithProps({
  openConsentManager,
}: {
  openConsentManager: () => void
}): React.ReactElement {
  return (
    ${footerJsxString}
  )
}

export default FooterWithProps\n`
  })
  // setup the layout file for this product
  await setupIoLayout({ layoutDir: destDirs.layouts, productData })
  await editFile(`${destDirs.layouts}/index.tsx`, (contents) => {
    return contents.replace(
      "import Footer from 'components/_proxied-dot-io/waypoint/footer'",
      "import Footer from 'components/_proxied-dot-io/waypoint/footer-with-props'"
    )
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
  // DOCS
  //
  const componentsPath = destDirs.components.replace('src/', '')
  const additionalComponentImports = `import Placement from '${componentsPath}/placement-table'\nimport NestedNode from '${componentsPath}/nested-node'\n`
  const additionalComponents = '{ Placement, NestedNode }'
  // delete existing docs page
  try {
    await exec(
      `rm -f ${path.join(destDirs.pages, 'docs', '\\[\\[...page\\]\\].jsx')}`
    )
  } catch {
    // do nothing
  }
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'docs',
    productData,
    additionalComponentImports,
    additionalComponents,
  })
  //
  // COMMANDS
  //
  // delete existing docs page
  try {
    await exec(
      `rm -f ${path.join(
        destDirs.pages,
        'commands',
        '\\[\\[...page\\]\\].jsx'
      )}`
    )
  } catch {
    // do nothing
  }
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'commands',
    productData,
  })
  //
  // PLUGINS
  //
  try {
    await exec(
      `rm -f ${path.join(destDirs.pages, 'plugins', '\\[\\[...page\\]\\].jsx')}`
    )
  } catch {
    // do nothing
  }
  // use standardized template
  await setupDocsRoute({
    pagesDir: destDirs.pages,
    basePath: 'plugins',
    productData,
  })
  //
  // COMMUNITY
  //
  await editFile(`${destDirs.pages}/community/index.jsx`, (contents) => {
    return addProxyLayout(contents, 'CommunityPage', productData)
  })
  //
  // DOWNLOADS
  //
  await editFile(`${destDirs.pages}/downloads/index.jsx`, (contents) => {
    let newContents = contents
      .replace(
        "import VERSION, { packageManagers } from 'data/version.js'\n",
        ''
      )
      .replace(
        "import { productName, productSlug } from 'data/metadata'",
        "import productData from 'data/waypoint'"
      )
      .replace('productName={productName}', 'productName={productData.name}')
      .replace('productId={productSlug}', 'productId={productData.slug}')
      .replace(
        'packageManagers={packageManagers}',
        'packageManagers={productData.packageManagers}'
      )
      .replace('latestVersion={VERSION}', 'latestVersion={productData.version}')
      .replace('latestVersion: VERSION,', 'latestVersion: productData.version,')

    newContents = addProxyLayout(newContents, 'DownloadsPage', productData)
    return newContents
  })
  //
  // COPYRIGHT POLICY
  //
  await editFile(`${destDirs.pages}/copyright-policy/index.jsx`, (contents) => {
    return addProxyLayout(contents, 'CopyrightPolicyPage', productData)
  })
  //
  // TERMS OF USE
  //
  await editFile(`${destDirs.pages}/terms/index.jsx`, (contents) => {
    return addProxyLayout(contents, 'TermsOfUsePage', productData)
  })
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a standardized template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })
}
