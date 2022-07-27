import { ButtonProps } from 'components/button'

/**
 * The inherited props from Button.
 */
type PickedButtonProps = Pick<
	ButtonProps,
	'aria-label' | 'color' | 'icon' | 'iconPosition' | 'size' | 'text'
>

/**
 * The additional custom props for ButtonLink.
 */
interface ButtonLinkProps extends PickedButtonProps {
	href: string
	openInNewTab?: boolean
}

export type { ButtonLinkProps }
