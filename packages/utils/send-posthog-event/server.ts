import { PostHog } from 'posthog-node'

// Per the PostHog documentation:
// 	Note: Because server-side functions in Next.js can be short-lived, we set flushAt to 1 and flushInterval to 0.
// 		- flushAt sets how many capture calls we should flush the queue (in one batch).
// 		- flushInterval sets how many milliseconds we should wait before flushing the queue. Setting them to the lowest number ensures events are sent immediately and not batched. We also need to call await posthog.shutdown() once done.
// To learn more, see https://posthog.com/docs/libraries/next-js?tab=App+router#server-side-analytics

const PostHogClient = () => {
	const posthogClient = new PostHog(process.env.POSTHOG_PROJECT_API_KEY, {
		host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		flushAt: 1,
		flushInterval: 0,
	})
	return posthogClient
}

/**
 * Sends an event to PostHog on the server side. No user data is sent.
 * @param eventName Event name to send to PostHog
 * @param value Value object to send to PostHog
 */
export const sendPosthogEventServer = async (
	eventName: string,
	value: Record<string, any>
) => {
	const posthog = PostHogClient()
	posthog.capture({
		distinctId: 'anonymous_user',
		event: eventName,
		properties: {
			...value,
			$process_person_profile: false,
		},
	})

	await posthog.shutdown()
}
