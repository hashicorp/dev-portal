import Image, { ImageProps } from 'components/image'

/**
 * Returns the Image component configured with specific default behaviour.
 */
function MdxImage({
	alt,
	src,
	title,
}: Pick<ImageProps, 'alt' | 'src' | 'title'>) {
	return <Image alt={alt} noBorder src={src} title={title} />
}

export { MdxImage }
