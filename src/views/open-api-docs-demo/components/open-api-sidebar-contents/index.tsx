import { useMemo } from 'react'

import { SidebarNavMenuItem } from 'components/sidebar/components'
import { OperationGroup } from 'views/open-api-docs-demo/types'
import { useActiveSection } from 'lib/hash-links/use-active-section'
import s from './open-api-sidebar-contents.module.css'

export function OpenApiSidebarContents({
	operationGroups,
}: {
	operationGroups: OperationGroup[]
}) {
	// Determine active section
	const operationSlugs = useMemo(
		() => operationGroups.map(({ items }) => items.map((o) => o.slug)).flat(),
		[operationGroups]
	)
	const activeSection = useActiveSection(operationSlugs)

	/**
	 * Build nav items for operation groups
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
						fullPath: `#${o.slug}`,
						isActive: o.slug === activeSection,
					})),
				]
			})
			.flat()
	}, [operationGroups, activeSection])

	return (
		<ul className={s.listResetStyles}>
			{[
				{
					title: 'HCP Vault Secrets API',
					fullPath: '/open-api-docs-demo',
					theme: 'hcp',
					isActive: true,
				},
				...operationNavItems,
			].map((item: $TSFixMe, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<SidebarNavMenuItem item={item} key={index} />
			))}
		</ul>
	)
}
