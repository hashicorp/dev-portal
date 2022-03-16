import { BreadcrumbLink } from 'components/breadcrumb-bar'

interface TutorialsBreadcrumbOptions {
  product: BasePathType
  collection?: BasePathType
  tutorial?: BasePathType
}

type BasePathType = {
  name: string
  slug: string
}

export function getTutorialsBreadcrumb({
  product,
  collection,
  tutorial,
}: TutorialsBreadcrumbOptions): BreadcrumbLink[] {
  const paths = [
    { title: 'Developer', url: '/' },
    { title: product.name, url: `/${product.slug}` },
    { title: 'Tutorials', url: `/${product.slug}/tutorials` },
  ]

  if (collection) {
    paths.push({
      title: collection.name,
      url: `/${product.slug}/tutorials/${collection.slug}`,
    })

    if (tutorial) {
      paths.push({
        title: tutorial.name,
        url: `/${product.slug}/tutorials/${collection.slug}/${tutorial.slug}`,
      })
    }
  }

  return paths
}
