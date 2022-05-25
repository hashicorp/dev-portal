type NativeButtonProps = JSX.IntrinsicElements['button']

interface DisclosureActivatorProps {
  ariaLabel?: NativeButtonProps['aria-label']
  children: NativeButtonProps['children']
  className?: NativeButtonProps['className']
}

export type { DisclosureActivatorProps }
