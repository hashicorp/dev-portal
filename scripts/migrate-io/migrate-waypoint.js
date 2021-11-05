const { setupProductMigration } = require('./_shared')

migrateWaypointIo()

async function migrateWaypointIo() {
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
  await setupProductMigration(productData)
  //   const { repoDirs, destDirs } = await setupProductMigration(productData)
}
