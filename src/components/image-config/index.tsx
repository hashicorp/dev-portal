import { ReactElement } from 'react'
import getValidatedImgChild from './get-validated-image-child'
import Image from 'components/image'
import s from './image-config.module.css'
import { ImageConfigProps } from './types'

/**
 * Configure extra settings for images via MDX.
 * Designed to wrap a single markdown image.
 */
export default function ImageConfig({
	children,
	caption,
	hideBorder = false,
	width,
	height,
	inline,
}: ImageConfigProps): ReactElement {
	const imgElement = getValidatedImgChild(children)
	// Validate that the { src, alt, title } props are present
	const { src, alt, title } = imgElement.props
	// Validate that src is present, and is a non-empty string
	if (typeof src !== 'string' || src == '') {
		throw new Error(
			`Images in MDX must have an source defined. Use the format ![some alt text](path/to/img.jpg). Image details: ${JSON.stringify(
				{ src, alt, title }
			)} `
		)
	}

	if (caption) {
		// If a caption has been provided, then render an image with a caption.
		// Note that we ignore the hideBorder prop in this case.
		return (
			<figure className={s.figure}>
				<Image
					src={src}
					alt={alt}
					title={title}
					noMargin
					noBorder={hideBorder}
					width={width}
					height={height}
					inline={inline}
				/>
				<figcaption className={s.caption}>{caption}</figcaption>
			</figure>
		)
	} else {
		// Otherwise render a plain image tag
		return (
			<Image
				src={src}
				alt={alt}
				title={title}
				noBorder={hideBorder}
				width={width}
				height={height}
				inline={inline}
			/>
		)
	}
}
