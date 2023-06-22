import NextImage, { ImageProps as NextImageProps } from 'next/image'
import s from './mdx-themed-image.module.css'

interface MdxThemedImageProps {
	src: { dark: string; light: string }
	width: NextImageProps['width']
	height: NextImageProps['height']
	title?: NextImageProps['title']
	alt?: NextImageProps['alt']
}

// TODO handle captions

export function MdxThemedImage({
	src,
	alt = '',
	title,
	width,
	height,
}: MdxThemedImageProps) {
	if (!src || !src.light || !src.dark) {
		throw new Error(
			`[ThemedImage]: Please provide both 'dark' and 'light' src values`
		)
	}

	// if no width and height passed, do auto dimensions... is this possible?
	return (
		<>
			<span data-hide-on-theme="dark" className={s.root}>
				<NextImage
					className={s.image}
					src={src.light}
					alt={alt}
					title={title}
					width={width}
					height={height}
				/>
			</span>
			<span data-hide-on-theme="light" className={s.root}>
				<NextImage
					className={s.image}
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
