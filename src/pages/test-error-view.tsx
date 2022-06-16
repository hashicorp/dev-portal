import { useState } from 'react'

function TestErrorView() {
  const [errorProneIndex, setErrorProneIndex] = useState(0)

  const messages = [{ text: 'This is a test error page.' }]

  function throwError() {
    setErrorProneIndex(10)
  }

  return (
    <p style={{ color: 'red' }}>
      {messages[errorProneIndex].text}{' '}
      <button onClick={throwError}>Throw an error</button>
    </p>
  )
}

export default TestErrorView
