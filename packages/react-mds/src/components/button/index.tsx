import { type ForwardRefExoticComponent, forwardRef } from 'react'
import { ButtonProps } from './types'
import { determineColor, LINK_TYPE_ICON_MAP } from './utils'
import { StandaloneLink } from '../standalone-link'
import { HDSButton } from '../../hds/components/button'

const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
	(
		{
			locale,
			text,
			title,
			url,
			href,
			linkType,
			onClick,
			external,
			className,
			size,
			icon,
			iconPosition = 'trailing',
			label,
			disabled,
			type,
			theme,
			...rest
		},
		ref
	) => {
		const color = determineColor(theme)

		if (color === 'tertiary') {
			// We prefer the Standalone Link component over the tertiary
			// button styles.
			return (
				<StandaloneLink
					text={(text || title) as string}
					color={
						theme?.background === 'dark' ? 'secondary-inverted' : 'secondary'
					}
					href={url || href}
					icon={linkType ? LINK_TYPE_ICON_MAP[linkType] : icon}
					iconPosition={linkType ? 'trailing' : iconPosition}
					className={className}
					onClick={onClick as () => void}
					size={size}
					isHrefExternal={linkType === 'outbound' || external}
					ref={ref as ForwardRefExoticComponent<HTMLAnchorElement>}
					locale={locale}
				/>
			)
		}

		return (
			<HDSButton
				text={text || title}
				href={url || href}
				isHrefExternal={linkType === 'outbound' || external}
				color={determineColor(theme)}
				type={type}
				icon={linkType ? LINK_TYPE_ICON_MAP[linkType] : icon}
				iconPosition={linkType ? 'trailing' : iconPosition}
				onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
				className={className}
				// Default buttons to the large size unless we specifically request the
				// small variant
				size={size === 'small' ? 'medium' : 'large'}
				aria-label={label}
				disabled={disabled}
				ref={ref as ForwardRefExoticComponent<HTMLButtonElement>}
				locale={locale}
				{...rest}
			/>
		)
	}
)

Button.displayName = 'Button'

export { Button }
