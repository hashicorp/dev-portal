import posthog from 'posthog-js'

/**
 * A custom hook to send a custom event to PostHog.
 *
 * @param {string} eventName - The name of the custom event to be tracked in PostHog.
 * @param {Record<string, any>} properties - A key-value object containing properties associated with the event.
 *
 * @example
 * const MyComponent = () => {
 *   sendPosthogEvent('button_click', { buttonId: 'submit', action: 'clicked' });
 *   return <button id="submit">Submit</button>;
 * };
 */
const sendPosthogEvent = (
	eventName: string,
	properties: Record<string, any>
) => {
	posthog.capture(eventName, properties)
}

export default sendPosthogEvent
