import ReactDocsPage, { DocsPageProps } from '@hashicorp/react-docs-page'
import ImageConfigBase from 'components/image-config'
import { ImageConfigProps } from 'components/image-config/types'

const ioComponents = {
	ImageConfig: (props: ImageConfigProps) => (
		<ImageConfigBase hideBorder {...props} />
	),
}

/**
 * A shared wrapper around react-docs-page to inject common authoring components for our .io docs pages.
 */
export default function DocsPage({
	additionalComponents,
	...props
}: DocsPageProps) {
	return (
		<ReactDocsPage
			additionalComponents={{ ...ioComponents, ...additionalComponents }}
			{...props}
		/>
	)
}
