import { toast, ToastColor } from 'components/toast'
import { OptInPlatformOption, PlatformOptionTitles } from '../types'

export function makeBetaWelcomeToast(optInPlatform: OptInPlatformOption) {
  // Get the product name
  const platformName = PlatformOptionTitles[optInPlatform]
  // Make toast
  toast({
    color: ToastColor.highlight,
    title: `Welcome to the ${platformName} Website Beta!`,
    description:
      'You can leave the Beta at anytime by clicking the Leave Beta button near the start of the main content area.',
    autoDismiss: 15000,
  })
}
