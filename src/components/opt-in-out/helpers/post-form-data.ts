import { allowedKeys } from 'pages/api/opt-out-feedback'

type AllowedFormKeys = typeof allowedKeys[number]

type OptOutData = {
  [key in AllowedFormKeys]: string | null
}

export async function postFormData(data: OptOutData) {
  try {
    const res = await fetch('/api/opt-out-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (res.status === 204 || res.status === 200) {
      process.env.NODE_ENV !== 'production' && console.log('Feedback submitted')
    } else {
      console.warn(`${res.status}: Unexpected result from feedback api`)
    }
  } catch (e) {
    console.error(e)
  }
}
