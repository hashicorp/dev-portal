import NextImage, { ImageProps as NextImageProps } from 'next/image'
import s from './mdx-themed-image.module.css'

interface MdxThemedImageProps {
	src: { dark: string; light: string }
	width?: NextImageProps['width']
	height?: NextImageProps['height']
	title?: NextImageProps['title']
	alt?: NextImageProps['alt']
}

export function MdxThemedImage({
	src,
	alt = '',
	title,
	width,
	height,
}: MdxThemedImageProps) {
	const widthAndHeightDefined = Boolean(width) && Boolean(height)

	if (!src || !src.light || !src.dark) {
		throw new Error(
			`[ThemedImage]: Please provide both 'dark' and 'light' src values`
		)
	}

	return (
		<>
			<span data-hide-on-theme="dark" className={s.root}>
				{widthAndHeightDefined ? (
					<NextImage
						className={s.image}
						src={src.light}
						alt={alt}
						title={title}
						width={width}
						height={height}
					/>
				) : (
					<img className={s.image} src={src.light} alt={alt} title={title} />
				)}
			</span>
			<span data-hide-on-theme="light" className={s.root}>
				{widthAndHeightDefined ? (
					<NextImage
						className={s.image}
						src={src.dark}
						alt={alt}
						title={title}
						width={width}
						height={height}
					/>
				) : (
					<img className={s.image} src={src.dark} alt={alt} title={title} />
				)}
			</span>
		</>
	)
}
