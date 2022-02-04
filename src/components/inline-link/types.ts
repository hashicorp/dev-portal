import { TextProps } from 'components/text'

export interface InlineLinkProps {
  className?: string
  href: string
  size: 100 | 200 | 300
  text: string
  weight?: TextProps['weight']
}
