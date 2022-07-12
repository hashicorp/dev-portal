import { OptInPlatformOption } from 'components/opt-in-out/types'
import { optOutOptions } from '.'

export interface OptOutFormProps {
  onSubmit(state: OptOutFormState): void
  onDismiss(): void
  platform: OptInPlatformOption
}

export interface OptOutFormState {
  optOutReason: typeof optOutOptions[number] | null
  optOutDetails: string | null
}
