import $$layoutName from '$$layoutPath'
$$additionalComponentImports
import DocsPage from '@hashicorp/react-docs-page'
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'
import productConfig from 'data/$$productSlug.json'

// because some of the util functions still require param arity, but we ignore
// their values when process.env.ENABLE_VERSIONED_DOCS is set to true, we'll
// just use this string to make it clear by using this k/v
const temporary_noop = 'im just for show'

const product = { name: productConfig.name, slug: productConfig.slug }
const basePath = '$$basePath'
const additionalComponents = $$additionalComponents

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function DocsView(props) {
  return (
    <DocsPage
      product={product}
      baseRoute={basePath}
      staticProps={props}
      showVersionSelect={!!+process.env.ENABLE_VERSIONED_DOCS}
      additionalComponents={additionalComponents}
    />
  )
}

export async function getStaticPaths() {
  const paths = await generateStaticPaths({
    navDataFile: temporary_noop,
    localContentDir: temporary_noop,
    // new ----
    product: product,
    basePath,
  })
  return {
    fallback: 'blocking',
    paths,
  }
}

export async function getStaticProps({ params }) {
  const props = await generateStaticProps({
    navDataFile: temporary_noop,
    localContentDir: temporary_noop,
    product: product,
    params,
    basePath,
  })
  return {
    props,
    revalidate: 10,
  }
}

DocsView.layout = $$layoutName
export default DocsView
