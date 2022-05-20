import { getStaticGenerationFunctions as _getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'

// TODO fill in types of properties
const generateGetStaticProps = ({ product, basePath, baseName }) => {
  // TODO fill in type of context
  return async (context) => {
    const { getStaticProps: generatedGetStaticProps } =
      _getStaticGenerationFunctions({
        product,
        basePath,
        baseName,
      })

    // TODO: replace any with accurate tpe
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
