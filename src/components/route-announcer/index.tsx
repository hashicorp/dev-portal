/**
 * Note: this file is a near-duplicate of NextJS's included
 * route announcer:
 *
 * https://github.com/vercel/next.js/blob/v14.2.1/packages/next/src/client/route-announcer.tsx
 *
 * It seems that `aria-live="assertive"`, as used there, results
 * in the announcement not being read out at all (at least in some
 * basic testing). This version uses `aria-live="polite"` instead,
 * which seems to work as expected, with route changes being
 * announced consistently.
 */

import React from 'react'
import { useRouter } from 'next/router'

const nextjsRouteAnnouncerStyles: React.CSSProperties = {
	border: 0,
	clip: 'rect(0 0 0 0)',
	height: '1px',
	margin: '-1px',
	overflow: 'hidden',
	padding: 0,
	position: 'absolute',
	top: 0,
	width: '1px',

	// https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
	whiteSpace: 'nowrap',
	wordWrap: 'normal',
}

export const RouteAnnouncer = () => {
	const { asPath } = useRouter()
	const [routeAnnouncement, setRouteAnnouncement] = React.useState('')

	// Only announce the path change, but not for the first load because screen
	// reader will do that automatically.
	const previouslyLoadedPath = React.useRef(asPath)

	// Every time the path changes, announce the new page’s title following this
	// priority: first the document title (from head), otherwise the first h1, or
	// if none of these exist, then the pathname from the URL. This methodology is
	// inspired by Marcy Sutton’s accessible client routing user testing. More
	// information can be found here:
	// https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
	React.useEffect(
		() => {
			console.log('asPath changed!')
			console.log({
				asPath,
				previouslyLoadedPath: previouslyLoadedPath.current,
			})
			// If the path hasn't change, we do nothing.
			if (previouslyLoadedPath.current === asPath) return
			previouslyLoadedPath.current = asPath

			if (document.title) {
				console.log(
					`setting routeAnnouncement to document.title: ${document.title}`
				)
				setRouteAnnouncement(document.title)
			} else {
				const pageHeader = document.querySelector('h1')
				const content = pageHeader?.innerText ?? pageHeader?.textContent

				console.log(`setting routeAnnouncement to content: ${content}`)
				setRouteAnnouncement(content || asPath)
			}
		},
		// TODO: switch to pathname + query object of dynamic route requirements
		[asPath]
	)

	return (
		<p
			aria-live="polite"
			id="__next-route-announcer_debug__"
			role="alert"
			style={nextjsRouteAnnouncerStyles}
		>
			{routeAnnouncement}
		</p>
	)
}

export default RouteAnnouncer
