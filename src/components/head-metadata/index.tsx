import HashiHead from '@hashicorp/react-head'
import { useCurrentProduct } from 'contexts'
import { HeadMetadataProps } from './types'

/**
 * Builds up the the necessary meta tags for the site. Rendered in `_app`, where it receives `pageProps.metadata` as props
 */
export default function HeadMetadata(props: HeadMetadataProps) {
  const { name: productName } = useCurrentProduct() ?? {}

  const titleParts = [__config.dev_dot.meta.title]
  const description = props.description ?? __config.dev_dot.meta.description

  if (productName) {
    titleParts.unshift(productName)
  }

  if (props.title) {
    titleParts.unshift(props.title)
  }

  // Ultimately we want to build up a title that looks like {specified page title} | {product} | {root title title}
  const title = titleParts.join(' | ')

  return (
    // TODO: OpenGraph image to be passed as the image prop here
    <HashiHead
      title={title}
      siteName={title}
      pageName={title}
      description={description}
    >
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="google-site-verification"
        content="zRQZqfAsOX-ypXfU0mzAIzb5rUvj5fA4Zw2jWJRN-JI"
      />
    </HashiHead>
  )
}
