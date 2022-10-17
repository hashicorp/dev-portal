import React from 'react'
import Head from 'next/head'
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

	// For google/SEO we'll omit any structured data items
	// without a URL.
	const structuredData = [
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: links
				// remove items without a url
				.filter((e) => !!e.url)
				.map((link, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: link.title,
					item: `https://developer.hashicorp.com${link.url}`,
				})),
		},
	]
	const stringifiedStructuredData = JSON.stringify(structuredData)

	return (
		<nav aria-label="Breadcrumb" className={s.root}>
			<Head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: stringifiedStructuredData }}
				/>
			</Head>
			<ol className={s.listRoot}>
				{links.map(({ title, url, isCurrentPage }) => {
					const cleanTitle = title.replace(/<[^>]+>/g, '')
					const Elem = url ? InternalLink : 'span'
					return (
						<Text
							asElement="li"
							className={s.listItem}
							key={`${cleanTitle}_${url}`}
							size={100}
							weight="medium"
						>
							<Elem
								className={s.breadcrumbText}
								href={url}
								aria-current={isCurrentPage ? 'page' : undefined}
							>
								{cleanTitle}
							</Elem>
						</Text>
					)
				})}
			</ol>
		</nav>
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
