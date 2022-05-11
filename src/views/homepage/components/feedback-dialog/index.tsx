import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Button from 'components/button'
import Dialog from 'components/dialog'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './feedback-dialog.module.css'

export default function FeedbackDialog({
  isOpen,
  onDismiss,
  onSuccess,
}: {
  isOpen: boolean
  onDismiss: () => void
  onSuccess: () => void
}) {
  const router = useRouter()
  const handleSubmit = (e) => {
    e.preventDefault()
    const id = window.analytics.user().anonymousId()
    fetch('http://localhost:5000/users', {
      body: JSON.stringify({
        id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).finally(() => {
      fetch('http://localhost:5000/submissions', {
        body: JSON.stringify({
          slug: 'feedback-form',
          page_url: router.asPath,
          user_id: id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then(async (res) => {
        const formData = new FormData(e.target)
        const data = await res.json()
        fetch(`http://localhost:5000/submissions/${data.result.id}/responses`, {
          body: JSON.stringify({
            question: 'Rate your experience 1 to 5',
            answer: formData.get('experience-rating'),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }).then((res) => {
          const formData = new FormData(e.target)
          fetch(
            `http://localhost:5000/submissions/${data.result.id}/responses`,
            {
              body: JSON.stringify({
                question: 'Do you have any other feedback?',
                answer: formData.get('feedback'),
              }),
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
            }
          ).then((res) => {
            onSuccess()
            setTimeout(() => {
              toast.success('Thanks for your feedback', {
                duration: 2000,
              })
            }, 500)
          })
        })
      })
    })
  }

  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} label="Feedback dialog">
      <header className={s.header}>
        <Heading level={2} size={300} weight="semibold">
          Are you sure you want to leave the Learn Beta?
        </Heading>
        <Text size={300} className={s.description}>
          Please submit any feedback you have before you opt-out.
        </Text>
      </header>
      <form className={s.form} onSubmit={handleSubmit}>
        <div className={s.content}>
          <select className={s.select} name="experience-rating">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <textarea
            name="feedback"
            className={s.textArea}
            placeholder="Your feedback (optional)..."
          ></textarea>
        </div>
        <footer className={s.footer}>
          <Button text="Submit feedback" type="submit" />
          <Button
            text="Cancel"
            color="secondary"
            onClick={onDismiss}
            type="button"
          />
        </footer>
      </form>
    </Dialog>
  )
}
