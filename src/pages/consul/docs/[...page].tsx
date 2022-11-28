import { withTiming } from 'lib/with-timing'
import DocsView from 'views/docs-view'
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'

const { getStaticPaths: _getStaticPaths, getStaticProps: _getStaticProps } =
	getRootDocsPathGenerationFunctions('consul', 'docs')

const getStaticPaths = (ctx) => {
	return withTiming(`[consul/docs/[...page]::getStaticPaths]`, () =>
		_getStaticPaths(ctx)
	)
}
const getStaticProps = (ctx) => {
	return withTiming(
		`[consul/docs/[...page]::getStaticProps] (${ctx.params.page})`,
		() => _getStaticProps(ctx)
	)
}

export { getStaticProps, getStaticPaths }
export default DocsView
