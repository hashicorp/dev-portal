import { IconArrowUpRight16 } from '@hashicorp/flight-icons/svg-react/arrow-up-right-16'
import { toast, ToastColor } from 'components/toast'
import Button from 'components/button'
import { ToastDisplayProps } from 'components/toast/components/toast-display/types'
import { OptInPlatformOption, PlatformOptionTitles } from '../types'

export default function makeBetaWelcomeToast(
  optInPlatform: OptInPlatformOption,
  handleOptOut: () => void
) {
  // Get the product name
  const platformName = PlatformOptionTitles[optInPlatform]
  // Make toast
  toast({
    color: ToastColor.highlight,
    title: `Welcome to the ${platformName} Website Beta!`,
    description:
      'You can leave the Beta at anytime by clicking the Leave Beta button near the start of the main content area.',
    renderActions: ({
      dismissSelf,
    }: {
      dismissSelf: ToastDisplayProps['dismissSelf']
    }) => (
      <>
        <Button
          color="secondary"
          onClick={dismissSelf}
          size="small"
          text="Continue"
        />
        <Button
          color="tertiary"
          icon={<IconArrowUpRight16 />}
          iconPosition="trailing"
          onClick={handleOptOut}
          size="small"
          text="Leave beta"
        />
      </>
    ),
    autoDismiss: false,
  })
}
