import { useMemo } from 'react'

import { SidebarNavMenuItem } from 'components/sidebar/components'
import { OperationProps } from 'views/open-api-docs-demo/types'
import s from './open-api-sidebar-contents.module.css'
import { useActiveSection } from 'lib/hash-links/use-active-section'

export function OpenApiSidebarContents({
	operationObjects,
}: {
	operationObjects: OperationProps[]
}) {
	const operationSlugs = useMemo(
		() => operationObjects.map((o) => o.slug),
		[operationObjects]
	)
	const activeSection = useActiveSection(operationSlugs)

	/**
	 * TODO: group into sections
	 */
	const operationNavItems = useMemo(
		() =>
			operationObjects.map((o) => ({
				title: o.operationId,
				fullPath: `#${o.slug}`,
				isActive: o.slug === activeSection,
			})),
		[operationObjects, activeSection]
	)

	return (
		<ul className={s.listResetStyles}>
			{[
				{
					title: 'HCP Vault Secrets API',
					fullPath: '/open-api-docs-demo',
					theme: 'hcp',
					isActive: true,
				},
				{
					divider: true,
				},
				...operationNavItems,
			].map((item: $TSFixMe, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<SidebarNavMenuItem item={item} key={index} />
			))}
		</ul>
	)
}
