type AnchorElementProps = JSX.IntrinsicElements['a']

export interface MaybeInternalLinkProps extends AnchorElementProps {
  href: AnchorElementProps['href']
}
