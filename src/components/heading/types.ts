/**
 * NOTE: this approach gets us around the following error:
 *
 * "An interface can only extend an identifier/qualified-name with optional type
 * arguments. ts(2499)"
 */
type HeadingElementProps =
	| JSX.IntrinsicElements['h1']
	| JSX.IntrinsicElements['h2']
	| JSX.IntrinsicElements['h3']
	| JSX.IntrinsicElements['h4']
	| JSX.IntrinsicElements['h5']
	| JSX.IntrinsicElements['h6']

export interface HeadingProps extends HeadingElementProps {
	/**
	 * Set the HTML heading level.
	 */
	level: 1 | 2 | 3 | 4 | 5 | 6
	/**
	 * Optionally use a different heading-x style than the default for the
	 * semantic HTML heading level. Note that only 0-4 are supported, as these are
	 * the styles we have available from the design system.
	 *
	 * Note: Display 600 is a style created specifically for Dev Dot.
	 * It does not yet exist in HDS. See `hds-typography-display-600.css`.
	 */
	size: 100 | 200 | 300 | 400 | 500 | 600
	weight: 'regular' | 'medium' | 'semibold' | 'bold'
}
