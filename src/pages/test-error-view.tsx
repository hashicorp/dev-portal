import { useState } from 'react'

function TestErrorView() {
  const [shouldThrowError, setShouldThrowError] = useState(false)

  if (shouldThrowError) {
    throw new Error(
      'This is a test error page, to test if errors are handled and tracked as we want them.'
    )
  }

  return (
    <p style={{ color: 'red' }}>
      This is a test error page.
      <button onClick={() => setShouldThrowError(true)}>Throw an error</button>
    </p>
  )
}

export default TestErrorView
