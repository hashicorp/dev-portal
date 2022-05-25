type NativeDivProps = JSX.IntrinsicElements['div']

interface DisclosureContentProps {
  children: NativeDivProps['children']
  className?: NativeDivProps['className']
}

export type { DisclosureContentProps }
