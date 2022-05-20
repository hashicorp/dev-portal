import { GetStaticPropsContext } from 'next'
import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import { GenerateGetStaticPropsArguments } from './types'

const generateGetStaticProps = ({
  baseName,
  basePath,
  product,
}: GenerateGetStaticPropsArguments) => {
  return async (context: GetStaticPropsContext) => {
    const { getStaticProps: generatedGetStaticProps } =
      _getStaticGenerationFunctions({
        product,
        basePath,
        baseName,
      })

    // TODO: replace any with accurate type
    const generatedProps = (await generatedGetStaticProps({
      ...context,
      params: { page: [] },
    })) as any

    // Clear out the `githubFileUrl`
    generatedProps.props.layoutProps.githubFileUrl = null

    // TODO handle rendering the sidecar in a follow-up PR
    generatedProps.props.layoutProps.sidecarSlot = null

    return generatedProps
  }
}

export { generateGetStaticProps }
