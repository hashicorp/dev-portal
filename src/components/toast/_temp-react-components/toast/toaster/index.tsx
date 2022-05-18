import { Toaster as ReactHotToaster } from 'react-hot-toast'

/**
 * Toaster
 * @description toaster component with predefined settings for positioning and toast gutters. Removes default toast styling from react-hot-toast and manages styling within the Notification components.
 */

export default function Toaster() {
  return (
    <ReactHotToaster
      position="bottom-left"
      gutter={16}
      containerStyle={{
        inset: 24,
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
