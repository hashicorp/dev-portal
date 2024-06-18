/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Layout
import SidebarLayout from 'layouts/sidebar-layout'
// Components
import {
	OperationDetails,
	OperationExamples,
	OperationHeader,
	OperationSections,
} from 'views/open-api-docs-view/components'
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
function OpenApiDocsViewV2({ operationProps, sidebarItemGroups }: $TSFixMe) {
	return (
		<SidebarLayout
			sidebarSlot={
				<div style={{ border: '1px solid magenta' }}>
					{sidebarItemGroups.map((group: $TSFixMe) => {
						return (
							<div key={group.title}>
								<p>{group.title}</p>
								<ul>
									{group.items.map((item) => {
										return (
											<li key={item.title}>
												<a href={item.url}>
													{item.title.replace(/([a-z])([A-Z])/g, '$1\u200B$2')}
												</a>
											</li>
										)
									})}
								</ul>
							</div>
						)
					})}
				</div>
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
				{operationProps ? (
					<OperationContents operationProps={operationProps} />
				) : null}
				{/* <pre>
					<code>
						{JSON.stringify({ operationSlug, operationProps }, null, 2)}
					</code>
				</pre>
				<pre>
					<code>{JSON.stringify({ staticProps }, null, 2)}</code>
				</pre> */}
			</div>
		</SidebarLayout>
	)
}

export default OpenApiDocsViewV2

function OperationContents({ operationProps }: $TSFixMe) {
	return (
		<div style={{ border: '1px solid magenta' }}>
			<OperationSections
				headerSlot={
					<OperationHeader
						className={s.header}
						slug={operationProps.slug}
						headingText={operationProps.summary}
						method={operationProps.type}
						path={operationProps.path.truncated}
					/>
				}
				examplesSlot={
					<OperationExamples
						heading={operationProps.summary}
						code={operationProps.urlPathForCodeBlock}
					/>
				}
				detailsSlot={
					<OperationDetails
						requestData={operationProps.requestData}
						responseData={operationProps.responseData}
					/>
				}
			/>
		</div>
	)
}
