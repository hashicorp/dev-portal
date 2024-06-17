/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party
import { paramCase } from 'change-case'
// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Styles
import s from './open-api-docs-view-v2.module.css'

/**
 * A revised version of OpenApiDocsView, that splits each operation
 * into its own URL.
 *
 * The intent here is to improve the user experience with manageable page sizes.
 * From there, we can move forward with implementing more complex features
 * within each operation page. Example:
 *
 * https://test-hcp-vs.readme.io/reference/settier
 *
 * TODO: this is just a stubbed placeholder for this work. Lots still to do:
 * - Render the links you *want* to work into the sidebarSlot (one link for
 *   each operation, initially they'll lead to 404s of course!)
 * - Figure out how to get the "preview" tool to work with a dynamic route,
 *   like `[[...page]].tsx`. I *think* this is feasible, but need to figure
 *   out how to do it... Maybe an `api` route that can receive the spec file,
 *   and store it in the `fs`? And on subsequent requests, can retrieve the
 *   spec file and generate pages accordingly? So to be more direct, the
 *   `getStaticPaths` function for the dynamic route would always fall back...
 *   And the `getStaticProps` would try to hit up that API route, with the
 *   requested path parameters. If we have a spec file already saved in the
 * 	 `fs`, then maybe we can return a meaningful operation page. Or if not,
 *    or if we have a spec file but the requested URL doesn't match an
 *    operation, then we fall back to returning a blank page with inputs to
 *    allow the preview user to pass a new spec file. (Note that even if we
 *    do successfully render a page, we'd probably still want some mechanism
 *    to allow the user to pass a new spec file, or adjust inputs... maybe
 *    the inputs would be on every page, or maybe we'd link back to the base
 *    URL for the dynamic route, where we'd always show the input?)
 * - Implement the actual operation pages (the `[[...page]].tsx` pages). I'm
 *   optimistic that this might be simple-ish relative to the question of
 *   how to get the preview tool working. We can probably leverage a lot of the
 *   prior art we have on processing the spec file & getting specific operation
 *   data... and similarly we can probably leverage a lot of prior components.
 *   The "v2 (split operations)" and original version of the views will most
 *   likely need to co-exist for a bit, so re-using logic could make sense...
 *   Although it could also make sense to wholesale copy-paste stuff, since
 *   I think our intent is to migrate all views to "v2", and while having stuff
 *   intertwined might feel like a natural form of abstraction, it's probably
 *   more confusing and difficult to migrate cleanly, so maybe not worth it.
 *
 * @param props
 * @returns
 */
function OpenApiDocsViewV2(props: $TSFixMe) {
	const { operationGroups } = props
	const sidebarItemGroups = operationGroups.map((group) => {
		const items = group.items.map((item) => {
			return {
				title: item.slug,
				url: `/open-api-docs-preview-v2/${paramCase(item.operationId)}`,
			}
		})
		return {
			title: group.heading,
			items,
		}
	})

	const debug = { sidebarItemGroups, opGroup: operationGroups[0] }
	return (
		<SidebarLayout
			sidebarSlot={
				<>
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
				</>
			}
			mobileMenuSlot={
				<>
					{/* <p style={{ border: '1px solid magenta' }}>
					TODO: populate mobileMenuSlot with meaningful content
				</p> */}
				</>
			}
		>
			<div className={s.paddedContainer}>
				<pre>
					<code>{JSON.stringify(debug, null, 2)}</code>
				</pre>
				<pre>
					<code>{JSON.stringify(props, null, 2)}</code>
				</pre>
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsViewV2
