import { useState } from 'react'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import '@reach/dialog/styles.css'
import Button from 'components/button'
import Dialog from 'components/dialog'
import OptOutForm from '../opt-out-form'
import { OptOutFormProps } from '../opt-out-form/types'

export function OptOutButtonAndDialog({
  handleOptOut,
}: {
  handleOptOut: OptOutFormProps['onSubmit']
}) {
  const [showDialog, setShowDialog] = useState(false)
  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)
  return (
    <div>
      <Button
        color="tertiary"
        text="Leave Beta"
        icon={<IconSignOut16 />}
        iconPosition="trailing"
        onClick={openDialog}
      />
      <Dialog onDismiss={closeDialog} isOpen={showDialog} label="Opt out form">
        <OptOutForm
          onSubmit={handleOptOut}
          onDismiss={closeDialog}
          platform="learn"
        />
      </Dialog>
    </div>
  )
}
