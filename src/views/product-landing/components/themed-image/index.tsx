import { ThemedImageProps } from './types'

/**
 * This component can be used in views where we need to
 * conditionally render an image based on the theme state.
 *
 * See styles/themes/global.css for the attribute handler
 * that uses `display:none` to conditionally render content
 * based on the theme state with css
 */
export default function ThemedImage({ src, alt }: ThemedImageProps) {
	return (
		<>
			{/* When the theme is dark, hide this div */}
			<img data-hide-on-theme="dark" src={src.light} alt={alt} />

			{/* When the theme is light, hide this div */}
			<img data-hide-on-theme="light" src={src.dark} alt={alt} />
		</>
	)
}
