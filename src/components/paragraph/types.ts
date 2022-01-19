/**
 * NOTE: this approach gets us around the following error:
 *
 * "An interface can only extend an identifier/qualified-name with optional type
 * arguments. ts(2499)"
 */
type ParagraphElementProps = JSX.IntrinsicElements['p']

export interface ParagraphProps extends ParagraphElementProps {
  size?: 100 | 200 | 300
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}
