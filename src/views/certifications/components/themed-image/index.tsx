import NextImage, { ImageProps as NextImageProps } from 'next/image'

interface ThemedMdxImageProps {
	lightSrc: string
	darkSrc: string
	alt: NextImageProps['alt']
	width: NextImageProps['width']
	height: NextImageProps['height']
	title?: NextImageProps['title']
}

export default function ThemedMdxImage({
	lightSrc,
	darkSrc,
	alt,
	title,
	width,
	height,
}: ThemedMdxImageProps) {
	if (!lightSrc || !darkSrc) {
		throw new Error(
			`[ThemedImage]: Please provide both 'dark' and 'light' src values`
		)
	}
	return (
		<>
			<span data-hide-on-theme="dark">
				<NextImage
					src={lightSrc}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
			<span data-hide-on-theme="light">
				<NextImage
					src={darkSrc}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
		</>
	)
}
