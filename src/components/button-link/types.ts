import { ButtonProps } from 'components/button'
type AnchorElementProps = JSX.IntrinsicElements['a']

/**
 * The inherited props from Button.
 */
type PickedButtonProps = Pick<
	ButtonProps,
	| 'aria-label'
	| 'color'
	| 'icon'
	| 'iconPosition'
	| 'size'
	| 'text'
	| 'className'
>

/**
 * The additional custom props for ButtonLink.
 */
interface ButtonLinkProps extends PickedButtonProps {
	href: string
	openInNewTab?: boolean
	onClick?: AnchorElementProps['onClick']
}

export type { ButtonLinkProps }
