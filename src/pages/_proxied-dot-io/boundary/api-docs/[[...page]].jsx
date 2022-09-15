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
import DevDotOptIn from 'components/_proxied-dot-io/common/dev-dot-opt-in'

const targetFile = {
	owner: 'hashicorp',
	repo: 'boundary',
	path: 'internal/gen/controller.swagger.json',
	ref: 'stable-website',
}
// The path to read from when running local preview in the context of the boundary repository
const targetLocalFile = '../../internal/gen/controller.swagger.json'

const pathFromRoot = 'api-docs'

function OpenApiDocsPage(props) {
	return (
		<OpenApiPage
			{...props}
			productName={productData.name}
			productSlug={productData.slug}
			baseRoute={pathFromRoot}
			optInBannerSlot={
				<DevDotOptIn cutoverDate={productData.devDotCutoverDate} />
			}
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
