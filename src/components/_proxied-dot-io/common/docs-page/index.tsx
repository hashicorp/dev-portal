import ReactDocsPage, { DocsPageProps } from '@hashicorp/react-docs-page'
import ImageConfigBase from 'components/image-config'
import { ImageConfigProps } from 'components/image-config/types'
import DevDotOptIn from '../dev-dot-opt-in'

const ioComponents = {
	ImageConfig: (props: ImageConfigProps) => (
		<ImageConfigBase hideBorder {...props} />
	),
}

interface ProxiedDocsPageProps extends DocsPageProps {
	devDotCutoverMessage?: {
		cutoverDate: string
		showCutoverDate: boolean
	}
}

/**
 * A shared wrapper around react-docs-page to inject common authoring components for our .io docs pages.
 */
export default function DocsPage({
	additionalComponents,
	devDotCutoverMessage,
	...props
}: ProxiedDocsPageProps) {
	/**
	 * Sentinel does not have a Developer page right now, so it cannot be opted-in
	 * to and we shouldn't show this alert.
	 */
	let showOptInBanner = true
	if ((props?.product?.slug as string) === 'sentinel') {
		showOptInBanner = false
	}

	return (
		<ReactDocsPage
			additionalComponents={{ ...ioComponents, ...additionalComponents }}
			optInBanner={
				showOptInBanner ? (
					<DevDotOptIn
						{...(devDotCutoverMessage ? devDotCutoverMessage : {})}
					/>
				) : undefined
			}
			{...props}
		/>
	)
}
