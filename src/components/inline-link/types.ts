import { TextProps } from 'components/text'

export interface InlineLinkProps {
  className?: string
  href: string
  size: TextProps['size']
  text: string
  weight?: TextProps['weight']
}
