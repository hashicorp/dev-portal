import { useEffect } from 'react'

function TestErrorView() {
  useEffect(() => {
    setTimeout(() => {
      throw new Error('This is a test error message.')
    }, 3000)
  }, [])

  return (
    <p style={{ color: 'red' }}>
      This is a test error page. It will self-destruct soon. Sorry!
    </p>
  )
}

export default TestErrorView
