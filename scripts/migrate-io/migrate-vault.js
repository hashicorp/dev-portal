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
  addGlobalStyles,
} = require('./_shared')

migrateVaultIo()

async function migrateVaultIo() {
  const productData = {
    name: 'Vault',
    slug: 'vault',
    version: '1.9.1',
    // TODO: confirm this is a decent place for this info
    algoliaConfig: {
      indexName: 'product_VAULT',
      searchOnlyApiKey: '9c555e8fa951c1c53e726c0ce2eb3b73',
    },
    // TODO: automate metadata extraction from _app.js
    // (lower priority, not something that seems to change often)
    metadata: {
      title: 'Vault by HashiCorp',
      description:
        'Vault secures, stores, and tightly controls access to tokens, passwords, certificates, API keys, and other secrets in modern computing. Vault handles leasing, key revocation, key rolling, auditing, and provides secrets as a service through a unified API.',
      image: '/vault/img/og-image.png',
      icon: [{ href: '/vault/img/favicon/_favicon.ico' }],
    },
    // TODO: parse alertBanner from _app.js
    alertBannerActive: true,
    alertBanner: {
      tag: 'Blog post',
      url: 'https://www.hashicorp.com/blog/a-new-chapter-for-hashicorp',
      text:
        'HashiCorp shares have begun trading on the Nasdaq. Read the blog from our founders, Mitchell Hashimoto and Armon Dadgar.',
      linkText: 'Read the post',
      // Set the expirationDate prop with a datetime string (e.g. '2020-01-31T12:00:00-07:00')
      // if you'd like the component to stop showing at or after a certain date
      expirationDate: '2021-12-17T23:00:00-07:00',
    },
    // TODO: parse subnavItems from navigation.js
    subnavItems: [
      { text: 'Overview', url: '/' },
      {
        text: 'Use Cases',
        submenu: [
          {
            text: 'Secrets Management',
            url: '/use-cases/secrets-management',
          },
          { text: 'Data Encryption', url: '/use-cases/data-encryption' },
          {
            text: 'Identity-based Access',
            url: '/use-cases/identity-based-access',
          },
        ],
      },
      {
        text: 'Enterprise',
        url: 'https://www.hashicorp.com/products/vault/enterprise',
      },
      'divider',
      { text: 'Tutorials', url: 'https://learn.hashicorp.com/vault' },
      { text: 'Docs', url: '/docs' },
      { text: 'API', url: '/api-docs' },
      { text: 'Community', url: '/community' },
    ],
    // TODO: parse from version.js
    packageManagers: [
      {
        label: 'Homebrew',
        commands: [
          'brew tap hashicorp/tap',
          'brew install hashicorp/tap/vault',
        ],
        os: 'darwin',
      },
      {
        label: 'Ubuntu/Debian',
        commands: [
          'curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -',
          'sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"',
          'sudo apt-get update && sudo apt-get install vault',
        ],
        os: 'linux',
      },
      {
        label: 'CentOS/RHEL',
        commands: [
          'sudo yum install -y yum-utils',
          'sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo',
          'sudo yum -y install vault',
        ],
        os: 'linux',
      },
      {
        label: 'Fedora',
        commands: [
          'sudo dnf install -y dnf-plugins-core',
          'sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo',
          'sudo dnf -y install vault',
        ],
        os: 'linux',
      },
      {
        label: 'Amazon Linux',
        commands: [
          'sudo yum install -y yum-utils',
          'sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo',
          'sudo yum -y install vault',
        ],
        os: 'linux',
      },
      {
        label: 'Homebrew',
        commands: [
          'brew tap hashicorp/tap',
          'brew install hashicorp/tap/vault',
        ],
        os: 'linux',
      },
    ],
  }
  // set up the source direction (cloned product repository)
  // and the destination directories (all within this project's source)
  const { repoDirs, destDirs } = await setupProductMigration('vault')

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
    'columns',
    'inline-tag',
    'footer',
    'homepage-hero',
    'before-after-diagram',
    'hcp-callout-section',
    'use-case-cta-section',
  ]
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${repoDirs.components}/${missingComponents[i]}`
    const destPath = `${destDirs.components}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
    await editFile(path.join(destPath, 'index.jsx'), (contents) => {
      return contents.replace(/public\/img/g, '../../../../../public/vault/img')
    })
  }

  // temporary fix for currentPath highlighting issue in subnav
  // TODO there must be a better way to do this?
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
    '/img/favicons/favicon.ico',
    '/img/og-image.png',
    // press kit
    // note: we have a redirect in place to allow consistent URL
    '/files/press-kit.zip',
    // footer card images
    // misc
    '/img/icons/alert.svg',
    '/img/icons/check.svg',
    // use cases
    '/img/use-cases/secrets-management/secrets-mgmt-challenge.png',
    '/img/use-cases/secrets-management/secrets-mgmt-solution.png',
    '/img/use-cases/secrets-management/dynamic_secrets@3x.png',
    '/img/use-cases/data-encryption/data-encryption-challenge.png',
    '/img/use-cases/data-encryption/data-encryption-solution.png',
    '/img/use-cases/data-encryption/encryption-features.png',
    '/img/use-cases/data-encryption/encryption-keyrolling@3x.png',
    '/img/use-cases/identity-based-access/identity-based-access-challenge.png',
    '/img/use-cases/identity-based-access/identity-based-access-solution.png',
    '/img/use-cases/identity-based-access/entities.png',
    '/img/use-cases/identity-based-access/control-groups.png',
    '/img/use-cases/identity-based-access/admin.png',
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
  // edit the subnav file to use the consolidated data file
  await editFile(`${destDirs.components}/subnav/index.jsx`, (contents) => {
    return contents
      .replace(
        "import { useRouter } from 'next/router'",
        "import { useRouter } from 'next/router'\nimport productData from 'data/vault.json'"
      )
      .replace(/productSlug/g, 'productData.slug')
      .replace("import menuItems from 'data/subnav'\n", '')
      .replace(/\{menuItems\}/g, '{productData.subnavItems}')
  })
  // setup a FooterWithProps component
  // TODO
  await exec(`mkdir ./${destDirs.components}/footer-with-props`)
  await exec(`touch ./${destDirs.components}/footer-with-props/index.tsx`)
  const appJsString = fs.readFileSync(`./${repoDirs.pages}/_app.js`, 'utf8')
  const footerJsxString = /<Footer([\S\s]*?)\/>/
    .exec(appJsString)[0]
    .replace(/'\/img/g, "'/vault/img")
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
      "import Footer from 'components/_proxied-dot-io/vault/footer'",
      "import Footer from 'components/_proxied-dot-io/vault/footer-with-props'"
    )
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
    // add Boundary .io layout
    newContents = addProxyLayout(newContents, 'Homepage', productData)
    // return
    return newContents
  })
  //
  // DOCS
  //
  const componentsPath = destDirs.components.replace('src/', '')
  const additionalComponentImports = `import Columns from '${componentsPath}/columns'\nimport Tag from '${componentsPath}/inline-tag'\n`
  const additionalComponents = '{ Columns, Tag }'
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
        "import productData from 'data/vault'"
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
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a standardized template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })

  /**
   * Use Cases
   */
  await editFile(
    path.join(destDirs.pages, 'use-cases', 'secrets-management', 'index.jsx'),
    (contents) => {
      let newContents = contents
      // replace component import paths
      newContents = newContents.replace(
        /from 'components\//g,
        `from 'components/_proxied-dot-io/${productData.slug}/`
      )

      newContents = addProxyLayout(
        newContents,
        'SecretsManagmentUseCase',
        productData
      )

      return newContents
    }
  )
  await editFile(
    path.join(
      destDirs.pages,
      'use-cases',
      'secrets-management',
      'content.json'
    ),
    (contents) => {
      let newContents = contents
      // replace component import paths
      newContents = newContents.replace(/"\/img\//g, '"/vault/img/')

      return newContents
    }
  )

  await editFile(
    path.join(destDirs.pages, 'use-cases', 'data-encryption', 'index.jsx'),
    (contents) => {
      let newContents = contents
      // replace component import paths
      newContents = newContents.replace(
        /from 'components\//g,
        `from 'components/_proxied-dot-io/${productData.slug}/`
      )

      newContents = addProxyLayout(
        newContents,
        'DataEncryptionUseCase',
        productData
      )

      return newContents
    }
  )
  await editFile(
    path.join(destDirs.pages, 'use-cases', 'data-encryption', 'content.json'),
    (contents) => {
      let newContents = contents
      // replace component import paths
      newContents = newContents.replace(/"\/img\//g, '"/vault/img/')

      return newContents
    }
  )
  await editFile(
    path.join(
      destDirs.pages,
      'use-cases',
      'identity-based-access',
      'index.jsx'
    ),
    (contents) => {
      let newContents = contents
      // replace component import paths
      newContents = newContents.replace(
        /from 'components\//g,
        `from 'components/_proxied-dot-io/${productData.slug}/`
      )

      newContents = addProxyLayout(
        newContents,
        'DataEncryptionUseCase',
        productData
      )

      return newContents
    }
  )
  await editFile(
    path.join(
      destDirs.pages,
      'use-cases',
      'identity-based-access',
      'content.json'
    ),
    (contents) => {
      let newContents = contents
      // replace component import paths
      newContents = newContents.replace(/"\/img\//g, '"/vault/img/')

      return newContents
    }
  )

  //
  // GLOBAL STYLES
  //
  // add the homepage stylesheet to our main style.css
  const missingStylesheets = [
    './_proxied-dot-io/vault/use-cases/style.css',
    '../components/_proxied-dot-io/vault/footer/style.css',
    '../components/_proxied-dot-io/vault/use-case-cta-section/style.css',
  ]
  await addGlobalStyles({ missingStylesheets, productName: productData.name })
}
