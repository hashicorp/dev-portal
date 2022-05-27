import { FormEvent, useState, ChangeEvent } from 'react'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import Button from 'components/button'
import Text from 'components/text'
import { PlatformOptionTitles } from 'components/opt-in-out/types'
import { OptOutFormProps } from './types'
import s from './opt-out-form.module.css'

export const optOutOptions = [
  'Missing Content',
  'Just checking it out',
  'Something broke',
  "I can't bookmark a tutorial",
  'No user progress on tutorials',
  'Something else?',
] as const

export default function OptOutForm({
  onSubmit,
  onDismiss,
  platform,
}: OptOutFormProps) {
  // Form state
  const [optOutReason, setOptOutReason] = useState(null)
  const [optOutDetails, setOptOutDetails] = useState(null)

  return (
    <form
      className={s.form}
      id="opt-out-form"
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit({ optOutReason, optOutDetails })
      }}
    >
      <div className={s.header}>
        <label
          htmlFor="opt-out-form"
          className={s.heading}
        >{`Why do you want to leave the ${PlatformOptionTitles[platform]} Developer Beta?`}</label>
        <Text className={s.subheading}>(optional)</Text>
        <button className={s.exitIcon} onClick={onDismiss} aria-label="Cancel">
          <IconX16 />
        </button>
      </div>
      <div className={s.feedback}>
        <label htmlFor="opt-out-select" hidden>
          Please select a reason
        </label>
        <select
          id="opt-out-select"
          className={s.select}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setOptOutReason(e.target.value)
          }
        >
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
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setOptOutDetails(e.target.value)
          }
        />
      </div>
      <div className={s.ctaButtons}>
        <Button
          form="opt-out-form"
          color="primary"
          text="Leave Beta"
          type="submit"
        />
        <Button color="secondary" text="Cancel" onClick={onDismiss} />
      </div>
    </form>
  )
}
