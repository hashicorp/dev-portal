import React from 'react'
import Link from 'next/link'
import isAbsoluteUrl from 'lib/is-absolute-url'
import Text from 'components/text'
import s from './breadcrumb-bar.module.css'

interface BreadcrumbLink {
	/** Text to be shown for the link */
	title: string
	/** The URL to link to. Must be internal, ie must not be an absolute URL. May be omitted for index-less routes. */
	url?: string
	/** Whether this breadcrumb represents the current page */
	isCurrentPage?: boolean
}

function BreadcrumbBar({
	links,
}: {
	links: BreadcrumbLink[]
}): React.ReactElement {
	// For now, we want to strictly require that all
	// breadcrumb link URLs, if present, are relative rather
	// than absolute links
	links
		.filter((l) => Boolean(l.url))
		.forEach((l) => {
			if (isAbsoluteUrl(l.url)) {
				throw new Error(
					`Absolute URL passed to BreadcrumbBar: "${JSON.stringify(
						l
					)}". Please ensure all "link.url" values are relative links.`
				)
			}
		})
	// Now that we're sure all links are relative,
	// we can render the breadcrumb links
	return (
		<nav aria-label="Breadcrumb" className={s.root}>
			<ol
				className={s.listRoot}
				itemScope
				itemType="http://schema.org/BreadcrumbList"
			>
				{links.map(({ title, url, isCurrentPage }, i) => {
					return (
						<Breadcrumb
							key={`${title}_${url}`}
							title={title}
							url={url}
							isCurrentPage={isCurrentPage}
							position={`${i + 1}`}
						/>
					)
				})}
			</ol>
		</nav>
	)
}

export interface BreadCrumbProps {
	title: string
	url: string
	isCurrentPage: boolean
	position: string
}
export const Breadcrumb: React.ComponentType<BreadCrumbProps> = ({
	title,
	url,
	isCurrentPage,
	position,
}) => {
	const cleanTitle = title.replace(/<[^>]+>/g, '')
	const Elem = url ? InternalLink : 'span'
	return (
		<Text
			asElement="li"
			className={s.listItem}
			size={100}
			weight="medium"
			itemProp="itemListElement"
			itemScope
			itemType="http://schema.org/ListItem"
		>
			<Elem
				className={s.breadcrumbText}
				href={url}
				aria-current={isCurrentPage ? 'page' : undefined}
				itemScope
				itemType="http://schema.org/Thing"
				itemProp="item"
			>
				<span itemProp="name">{cleanTitle}</span>
			</Elem>
			<meta itemProp="position" content={position} />
		</Text>
	)
}

function InternalLink({ href, children, ...rest }) {
	return (
		<Link href={href}>
			<a {...rest}>{children}</a>
		</Link>
	)
}

export type { BreadcrumbLink }
export default BreadcrumbBar
