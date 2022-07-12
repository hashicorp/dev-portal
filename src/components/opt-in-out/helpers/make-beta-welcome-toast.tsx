import { ToastDisplay, ToastColor } from 'components/toast'
import { OptInPlatformOption, PlatformOptionTitles } from '../types'
import { notification } from '@hashicorp/react-notification'

export function makeBetaWelcomeToast(optInPlatform: OptInPlatformOption) {
  // Get the product name
  const platformName = PlatformOptionTitles[optInPlatform]
  // Make toast
  notification(
    (n) => {
      return (
        <ToastDisplay
          color={ToastColor.highlight}
          title={`Welcome to the ${platformName} Website Beta!`}
          description="You can leave the Beta at anytime by clicking the Leave Beta button near the start of the main content area."
          dismissSelf={() => notification.remove(n.id)}
        />
      )
    },
    { id: 'beta-welcome-toast', duration: 15000 }
  )
}
