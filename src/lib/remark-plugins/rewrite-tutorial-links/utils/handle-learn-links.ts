import { ProductOption } from 'lib/learn-client/types'

type SplitLearnPath = [
  string, // the leading slash
  'collections' | 'tutorials',
  ProductOption,
  string
]

export function handleTutorialLink(
  nodePath: string,
  tutorialMap: { [key: string]: string }
) {
  const hasQueryParam = nodePath.includes('?')
  const hasAnchorLink = nodePath.includes('#')
  let queryParam

  if (hasQueryParam) {
    const [tutorialSlug, collectionSlug] = nodePath.split('?')
    nodePath = tutorialSlug
    queryParam = collectionSlug
  }

  const [, , product, filename] = nodePath.split('/') as SplitLearnPath

  const tutorialSlug = [product, filename].join('/')
  let finalSlug = tutorialMap[tutorialSlug]

  // if there is a query param, the collection name is in provided
  // so we don't use the tutorial map
  if (hasQueryParam) {
    // isolate the collection name from the query
    const [, collectionSlug] = queryParam.split('/')
    finalSlug = `/${product}/tutorials/${collectionSlug}/${filename}`

    // sometimes query params also have an anchor
    if (hasAnchorLink) {
      const [slug, anchor] = collectionSlug.split('#')
      const base = `/${product}/tutorials/${slug}/${filename}`
      finalSlug = [base, anchor].join('#')
    }
  } else if (hasAnchorLink) {
    const [isolatedSlug, anchor] = tutorialSlug.split('#')
    finalSlug = [tutorialMap[isolatedSlug], anchor].join('#')
  }

  return finalSlug
}

export function handleCollectionLink(nodePath: string) {
  const [, , product, filename] = nodePath.split('/') as SplitLearnPath

  return `/${product}/tutorials/${filename}`
}
