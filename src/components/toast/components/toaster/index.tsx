import { Toaster as ReactHotToaster } from 'react-hot-toast'

/**
 * react-hot-toast's Toaster component, with predefined settings.
 * Removes default toast styling from react-hot-toast,
 * and manages styling within the Notification components.
 *
 * Note: largely duplicative of a similar component in @hashicorp/react-toast:
 * https://github.com/hashicorp/react-components/blob/main/packages/toast/toaster/index.tsx
 */
export default function Toaster() {
	return (
		<ReactHotToaster
			position="bottom-right"
			gutter={16}
			containerStyle={{
				inset: 24,
				// z-index is one less than the reach dialog overlay's
				zIndex: 99,
			}}
			toastOptions={{
				style: {
					margin: 0,
					padding: 0,
					maxWidth: 404,
					width: '100%',
					backgroundColor: 'transparent',
					boxShadow: 'none',
					borderRadius: 0,
				},
			}}
		/>
	)
}
