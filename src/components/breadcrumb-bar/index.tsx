import React from 'react'
import Link from 'next/link'
import Script from 'next/script'
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

	const structuredData = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: links.map((link, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: link.title,
				item: link.url
					? `https://developer.hashicorp.com${link.url}`
					: undefined,
			})),
		},
	]
	const stringifiedStructuredData = JSON.stringify(structuredData)
	return (
		<nav aria-label="Breadcrumb" className={s.root}>
			<Script type="application/ld+json" id={stringifiedStructuredData}>
				{stringifiedStructuredData}
			</Script>
			<ol className={s.listRoot}>
				{links.map(({ title, url, isCurrentPage }, i) => {
					return (
						<Breadcrumb
							key={`${title}_${url}`}
							title={title}
							url={url}
							isCurrentPage={isCurrentPage}
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
}
export const Breadcrumb: React.ComponentType<BreadCrumbProps> = ({
	title,
	url,
	isCurrentPage,
}) => {
	const cleanTitle = title.replace(/<[^>]+>/g, '')
	const Elem = url ? InternalLink : 'span'
	return (
		<Text asElement="li" className={s.listItem} size={100} weight="medium">
			<Elem
				className={s.breadcrumbText}
				href={url}
				aria-current={isCurrentPage ? 'page' : undefined}
			>
				<span itemProp="name">{cleanTitle}</span>
			</Elem>
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
