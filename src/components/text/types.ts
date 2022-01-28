/**
 * NOTE: this approach gets us around the following error:
 *
 * "An interface can only extend an identifier/qualified-name with optional type
 * arguments. ts(2499)"
 */
type TextElementProps =
  | JSX.IntrinsicElements['li']
  | JSX.IntrinsicElements['p']
  | JSX.IntrinsicElements['span']

export type TextProps = TextElementProps & {
  asElement?: 'li' | 'p' | 'span'
  size?: 100 | 200 | 300
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}
