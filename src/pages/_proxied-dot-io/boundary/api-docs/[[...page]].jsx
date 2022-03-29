import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'
import productData from 'data/boundary'
import OpenApiPage from '@hashicorp/react-open-api-page'
/* Used server-side only */
import { isDeployPreview } from 'lib/env-checks'
import fetchGithubFile from 'lib/fetch-github-file'
import {
  getPathsFromSchema,
  getPropsForPage,
} from '@hashicorp/react-open-api-page/server'
import {
  processSchemaString,
  processSchemaFile,
} from '@hashicorp/react-open-api-page/process-schema'

const targetFile = {
  owner: 'hashicorp',
  repo: 'boundary',
  path: 'internal/gen/controller.swagger.json',
  ref: 'stable-website',
}
const targetLocalFile = '../../internal/gen/controller.swagger.json'

const pathFromRoot = 'api-docs'

function OpenApiDocsPage(props) {
  return (
    <OpenApiPage
      {...props}
      productName={productData.name}
      productSlug={productData.slug}
      baseRoute={pathFromRoot}
    />
  )
}

export async function getStaticPaths() {
  let schema
  if (isDeployPreview()) {
    schema = await processSchemaFile(targetLocalFile)
  } else {
    const swaggerFile = await fetchGithubFile(targetFile)
    schema = await processSchemaString(swaggerFile)
  }
  const paths = getPathsFromSchema(schema)
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  let schema
  if (isDeployPreview()) {
    schema = await processSchemaFile(targetLocalFile)
  } else {
    const swaggerFile = await fetchGithubFile(targetFile)
    schema = await processSchemaString(swaggerFile)
  }
  const props = getPropsForPage(schema, params)
  return { props }
}

OpenApiDocsPage.layout = BoundaryIoLayout
export default OpenApiDocsPage
