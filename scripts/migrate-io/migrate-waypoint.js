// const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const { setupProductMigration, setupSecurityPage } = require('./_shared')

migrateWaypointIo()

async function migrateWaypointIo() {
  const productData = {
    name: 'Waypoint',
    slug: 'waypoint',
    version: '0.5.2',
    // metadata: {
    //   title: 'Waypoint by HashiCorp',
    //   description:
    //     'Waypoint is  an open source solution that provides a modern workflow for build, deploy, and release across platforms.',
    //   image: '/img/waypoint/og-image.png',
    //   icon: [{ href: '/img/waypoint/_favicon.ico' }],
    // },
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
  // TODO
  // install dependencies required for proxied pages
  const npmDependencies = []
  console.log('⏳ Installing dependencies...')
  // await exec(`npm i ${npmDependencies.join(' ')}`)
  console.log('✅ Done')
  //
  // COMPONENTS
  //
  // TODO
  // copy components into dedicated directory
  const missingComponents = []
  for (let i = 0; i < missingComponents.length; i++) {
    const srcPath = `${repoDirs.components}/${missingComponents[i]}`
    const destPath = `${destDirs.components}/${missingComponents[i]}`
    await exec(`cp -r ${srcPath}/ ${destPath}`)
  }
  //
  // SECURITY PAGE
  //
  // delete existing security page, we'll use a standardized template
  await exec(`rm -f ${path.join(destDirs.pages, 'security', 'index.jsx')}`)
  await setupSecurityPage({ pagesDir: destDirs.pages, productData })
}
