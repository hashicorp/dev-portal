/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './sidebar-contents.module.css'

/**
 * Render sidebar contents to allow navigation between the operations in an
 * OpenAPI spec. Operations are expected to be rendered as separate pages.
 *
 * TODO: just a rough stub for now, need to actually design & implement
 */
export default function SidebarContents({
	_devProps,
	sidebarItemGroups,
}: {
	_devProps: $TSFixMe
	sidebarItemGroups: $TSFixMe
}) {
	return (
		<div className={s.root}>
			<a href="/open-api-docs-preview-v2">{_devProps.metadata.title} API</a>
			{sidebarItemGroups.map((group: $TSFixMe) => {
				return (
					<div key={group.title}>
						<p>{group.title}</p>
						<ul>
							{group.items.map((item) => {
								return (
									<li key={item.title}>
										<a href={item.url}>{item.title}</a>
									</li>
								)
							})}
						</ul>
					</div>
				)
			})}
		</div>
	)
}
