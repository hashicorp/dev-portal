import { productName, productSlug } from 'data/metadata'
import DocsPage from '@hashicorp/react-docs-page'
import {
  generateStaticPaths,
  generateStaticProps,
} from '@hashicorp/react-docs-page/server'

const NAV_DATA_FILE = 'data/intro-nav-data.json'
const CONTENT_DIR = 'content/sentinel/intro'
const basePath = 'sentinel/intro'

export default function DocsLayout(props) {
  return (
    <DocsPage
      product={{ name: productName, slug: productSlug }}
      baseRoute={basePath}
      showEditPage={false}
      staticProps={props}
    />
  )
}

export async function getStaticPaths() {
  // remove "intro" paths since we cover these in a separate layout
  // this type of nesting is an antipattern which is why it is an exception here
  // rather than built into the API
  return {
    fallback: false,
    paths: await generateStaticPaths({
      navDataFile: NAV_DATA_FILE,
      localContentDir: CONTENT_DIR,
    }),
  }
}

export async function getStaticProps({ params }) {
  return {
    props: await generateStaticProps({
      navDataFile: NAV_DATA_FILE,
      localContentDir: CONTENT_DIR,
      product: { name: productName, slug: productSlug },
      params,
    }),
  }
}
