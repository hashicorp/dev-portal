import { getStaticGenerationFunctions as getStaticGenerationFunctionsBase } from '@hashicorp/react-docs-page/server'

export const getStaticGenerationFunctions: typeof getStaticGenerationFunctionsBase = (
  ...args
) => {
  if (!args[0].revalidate && args[0].strategy === 'remote') {
    args[0].revalidate = __config.io_sites.revalidate
  }

  const {
    getStaticPaths: getStaticPathsBase,
    getStaticProps,
  } = getStaticGenerationFunctionsBase(...args)

  return {
    async getStaticPaths(ctx) {
      const result = await getStaticPathsBase(ctx)

      return {
        ...result,
        paths: result.paths.slice(0, __config.io_sites.max_static_paths ?? 0),
      }
    },
    getStaticProps,
  }
}
