type NativeAProps = JSX.IntrinsicElements['a']

interface NavigationDisclosureLinkProps {
  children: NativeAProps['children']
  className?: NativeAProps['className']
  href: NativeAProps['href']
  isActive: boolean
}

export type { NavigationDisclosureLinkProps }
