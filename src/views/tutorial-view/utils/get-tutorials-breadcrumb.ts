import { BreadcrumbLink } from 'components/breadcrumb-bar'

interface TutorialsBreadcrumbOptions {
  product: BasePathType
  collection?: BasePathType
  tutorial?: BasePathType
}

type BasePathType = {
  name: string
  filename: string
}

export function getTutorialsBreadcrumb({
  product,
  collection,
  tutorial,
}: TutorialsBreadcrumbOptions): BreadcrumbLink[] {
  const paths = [
    { title: 'Developer', url: '/' },
    { title: product.name, url: `/${product.filename}` },
    { title: 'Tutorials', url: `/${product.filename}/tutorials` },
  ]

  if (collection) {
    paths.push({
      title: collection.name,
      url: `/${product.filename}/tutorials/${collection.filename}`,
    })

    if (tutorial) {
      paths.push({
        title: tutorial.name,
        url: `/${product.filename}/tutorials/${collection.filename}/${tutorial.filename}`,
      })
    }
  }

  return paths
}
