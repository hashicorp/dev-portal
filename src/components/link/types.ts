import { LinkProps as NextLinkProps } from 'next/link'

type NativeAnchorProps = JSX.IntrinsicElements['a']
type InheritedNativeAnchorProps = Omit<NativeAnchorProps, 'href'>

interface LinkProps extends InheritedNativeAnchorProps {
	href: NextLinkProps['href']
	opensInNewTab?: boolean
}

export type { LinkProps }
