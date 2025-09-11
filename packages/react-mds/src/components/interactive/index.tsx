import { forwardRef, type ForwardRefExoticComponent } from 'react'
import type { ButtonHTMLAttributes, MouseEventHandler } from 'react'
import Link from 'next/link'

interface InteractiveProps extends React.HTMLAttributes<HTMLElement> {
	isHrefExternal?: boolean
	href?: string
	onClick?: MouseEventHandler
	type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
	prefetch?: boolean
	locale?: string
}

const Interactive = forwardRef<
	HTMLAnchorElement | HTMLButtonElement,
	InteractiveProps
>((props, ref) => {
	const {
		href,
		className,
		isHrefExternal,
		onClick,
		children,
		locale,
		...rest
	} = props

	// TODO: trigger link on space key up
	if (href) {
		return (
			<Link
				className={className}
				target={isHrefExternal ? '_blank' : undefined}
				rel={isHrefExternal ? 'noopener noreferrer' : undefined}
				onClick={onClick}
				{...getLocalizedLinkProps(href, locale, isHrefExternal)}
				{...rest}
				ref={ref as ForwardRefExoticComponent<HTMLAnchorElement>}
			>
				{children}
			</Link>
		)
	} else {
		return (
			<button
				type="button"
				className={className}
				onClick={onClick}
				{...rest}
				ref={ref as ForwardRefExoticComponent<HTMLButtonElement>}
			>
				{children}
			</button>
		)
	}
})
Interactive.displayName = 'Interactive'

/**
 * Smaller, local version of our getLocalizedLinkProps util,
 * cloned here to work around a cyclic dependency issue
 * with the main @web/utils package.
 *
 * @param url An internal URL path
 * @param locale A supported locale
 * @returns A prefixed URL if locale is defined, otherwise the URL without prefix
 */
export const getLocalizedLinkProps = (
	href: string,
	locale?: string,
	isHrefExternal?: boolean
): {
	href: string
	hrefLang: string | undefined
	isHrefExternal?: boolean
} => {
	if (isHrefExternal) {
		return {
			href: href,
			hrefLang: undefined,
		}
	}

	if (
		['en', 'de', 'es', 'fr', 'ja', 'ko', 'pt', 'id'].includes(
			href.substring(1, 3)
		)
	) {
		// Don't localize if the href is already localized
		return {
			href: href,
			hrefLang: href.substring(1, 3),
		}
	}

	if (href.startsWith('/') && locale) {
		return {
			href: `/${locale}${href}`,
			hrefLang: locale,
		}
	}

	return {
		href: href,
		hrefLang: undefined,
	}
}

export type { InteractiveProps }
export { Interactive }
