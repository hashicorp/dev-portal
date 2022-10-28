import { LinkProps as NextLinkProps } from 'next/link'

type NativeAnchorProps = JSX.IntrinsicElements['a']

type InheritedNextLinkProps = Omit<
	NextLinkProps,
	'href' | 'onClick' | 'onMouseEnter' | 'onTouchStart'
>

interface LinkProps extends NativeAnchorProps {
	nextLinkProps?: InheritedNextLinkProps
	opensInNewTab?: boolean
}

export type { LinkProps }
