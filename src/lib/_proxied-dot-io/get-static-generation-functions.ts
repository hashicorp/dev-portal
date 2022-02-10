import { getStaticGenerationFunctions as getStaticGenerationFunctionsBase } from '@hashicorp/react-docs-page/server'

export const getStaticGenerationFunctions: typeof getStaticGenerationFunctionsBase = (
  ...args
) => {
  const {
    getStaticPaths: getStaticPathsBase,
    getStaticProps,
  } = getStaticGenerationFunctionsBase(...args)

  return {
    async getStaticPaths(ctx) {
      const result = await getStaticPathsBase(ctx)

      return {
        ...result,
        paths: result.paths.slice(
          0,
          Number.parseInt(process.env.IO_SITES_MAX_STATIC_PATHS, 10)
        ),
      }
    },
    getStaticProps,
  }
}
