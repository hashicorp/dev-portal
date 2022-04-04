import { LinkProps } from 'next/link'

export type DirectionOption = 'next' | 'previous' | 'final'

export interface DirectionalLinkBoxProps {
  link: LinkProps
  label: string
  title: string
  direction: DirectionOption
}
