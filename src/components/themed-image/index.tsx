import { ThemedImageProps } from './types'

/**
 * This component can be used in views where we need to
 * conditionally render an image based on the theme state.
 *
 * See styles/themes/global.css for the attribute handler
 * that uses `display:none` to conditionally render content
 * based on the theme state with css
 */
export default function ThemedImage({ src, alt = '' }: ThemedImageProps) {
	/**
	 * @TODO could add protection here to throw
	 * when used outside of the theme context. Since the
	 * entire app is wrapped with the provier when using the
	 * core devdot layout, it's currently low-risk
	 * */
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
