import { useMemo } from 'react'
import { SidebarNavMenuItem } from 'components/sidebar/components'
import { OperationGroup } from 'views/open-api-docs-view/types'
import { useActiveSection } from 'lib/hash-links/use-active-section'
import { extractHashSlug } from 'lib/hash-links/extract-hash-slug'
import s from './open-api-sidebar-contents.module.css'

/**
 * Renders sidebar contents for OpenApiDocsView.
 *
 * TODO: refactor operationGroups prop,
 * should be `operationNavItems` instead, I think!
 * And `operationNavItems` should be build server-side.
 *
 * Note: `isActive` highlighting will still happen within this component.
 */
export function OpenApiSidebarContents({
	operationGroups,
}: {
	operationGroups: OperationGroup[]
}) {
	/**
	 * Build nav items for operation groups
	 *
	 * TODO: extract this out to getStaticProps
	 */
	const operationNavItems = useMemo(() => {
		// format to sidebar sections
		return Object.keys(operationGroups)
			.map((groupSlug: string) => {
				const { heading, items } = operationGroups[groupSlug]
				return [
					{ divider: true },
					{
						heading,
					},
					...items.map((o) => ({
						title: o.operationId,
						slug: o.slug,
						fullPath: `#${o.slug}`,
					})),
				]
			})
			.flat()
	}, [operationGroups])

	/**
	 * Determine the active section, based on operation slugs
	 */
	const operationSlugs = useMemo(
		() =>
			operationNavItems
				.filter((item) => typeof item.fullPath === 'string')
				.map((item) => extractHashSlug(item.fullPath)),
		[operationNavItems]
	)
	const activeSection = useActiveSection(operationSlugs)

	/**
	 * Highlight any active matched sections
	 */
	const operationNavItemsWithActive = useMemo(() => {
		return operationNavItems.map((item) => {
			// Handle dividers, headings, any non-path items
			if (!item.fullPath) {
				return item
			}
			// Handle items with paths, that could be a match
			return { ...item, isActive: item.fullPath === `#${activeSection}` }
		})
	}, [operationNavItems, activeSection])

	return (
		<ul className={s.listResetStyles}>
			{[
				{
					title: 'HCP Vault Secrets API',
					fullPath: '/hcp/api-docs/vault-secrets',
					theme: 'hcp',
					isActive: true, // always active, since this is a single-page
				},
				...operationNavItemsWithActive,
			].map((item: $TSFixMe, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<SidebarNavMenuItem item={item} key={index} />
			))}
		</ul>
	)
}
