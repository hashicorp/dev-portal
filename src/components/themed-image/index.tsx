interface ThemedImageProps {
	src: {
		dark: string
		light: string
	}
	alt?: string
}

/**
 * See styles/themes/dark.css for the global attribute handler
 * that uses `display:none` to conditionally render content
 * based on the theme state with css
 */
export default function ThemedImage({ src, alt = '' }: ThemedImageProps) {
	return (
		<>
			{/* When the theme is dark, hide this div */}
			<div data-hide-on-theme="dark">
				<img src={src.light} alt={alt} />
			</div>

			{/* When the theme is light, hide this div */}
			<div data-hide-on-theme="light">
				<img src={src.dark} alt={alt} />
			</div>
		</>
	)
}
