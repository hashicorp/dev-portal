export type DirectionOption = 'next' | 'previous' | 'final'

export interface DirectionalLinkBoxProps {
  href: string
  label: string
  title: string
  direction: DirectionOption
}
