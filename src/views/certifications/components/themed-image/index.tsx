import NextImage, { ImageProps as NextImageProps } from 'next/image'

interface ThemedMdxImageProps {
	src: {
		light: string
		dark: string
	}
	alt: NextImageProps['alt']
	width: NextImageProps['width']
	height: NextImageProps['height']
	title?: NextImageProps['title']
}

export default function ThemedMdxImage({
	alt,
	src,
	title,
	width,
	height,
}: ThemedMdxImageProps) {
	if (!src.light || !src.dark) {
		throw new Error(
			`[ThemedImage]: Please provide both 'dark' and 'light' src values`
		)
	}
	return (
		<>
			<span data-hide-on-theme="dark">
				<NextImage
					src={src.light}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
			<span data-hide-on-theme="light">
				<NextImage
					src={src.dark}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
		</>
	)
}
