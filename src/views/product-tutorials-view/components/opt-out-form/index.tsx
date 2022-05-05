import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import Button from 'components/button'
import Text from 'components/text'
import s from './opt-out-form.module.css'

interface OptOutFormProps {
  redirectUrl: string
  onDismiss(): void
  platform: 'vault' | 'waypoint' | 'learn'
}

enum platformOptions {
  vault = 'Vault',
  waypoint = 'Waypoint',
  learn = 'Learn',
}

const optOutOptions = [
  'Missing Content',
  'Just checking it out',
  'Something broke',
  "I can't bookmark a tutorial",
  'No user progress on tutorials',
  'Something else?',
]

/**
 *
 * TODO - make the buttons, submit / reset inputs?
 */

export default function OptOutForm({
  redirectUrl,
  onDismiss,
  platform,
}: OptOutFormProps) {
  return (
    <form className={s.form}>
      <div className={s.header}>
        <label
          htmlFor="opt-out-form"
          className={s.heading}
        >{`Why do you want to leave the ${platformOptions[platform]} Developer Beta?`}</label>
        <Text className={s.subheading}>(optional)</Text>
        <button className={s.exitIcon} onClick={onDismiss} aria-label="Cancel">
          <IconX16 />
        </button>
      </div>
      <div className={s.feedback}>
        <label htmlFor="opt-out-select" hidden>
          Please select a reason
        </label>
        <select id="opt-out-select" className={s.select}>
          <option>Select a reason</option>
          {optOutOptions.map((reason: string) => (
            <option key={reason.replaceAll(' ', '-')}>{reason}</option>
          ))}
        </select>
        <label htmlFor="optional-feedback-text" hidden>
          Enter additional feedback(optional)
        </label>
        <textarea
          id="optional-feedback-text"
          className={s.optionalText}
          placeholder=" More details (optional)..."
        />
      </div>
      <div className={s.ctaButtons}>
        <Button
          color="primary"
          text="Leave Beta"
          onClick={() => window.location.assign(redirectUrl)}
        />
        <Button color="secondary" text="Cancel" onClick={onDismiss} />
      </div>
    </form>
  )
}
