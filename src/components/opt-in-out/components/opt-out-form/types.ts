import { OptInPlatformOption } from 'components/opt-in-out/types'

export interface OptOutFormProps {
  onSubmit(): void
  onDismiss(): void
  platform: OptInPlatformOption
}
