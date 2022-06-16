function TestErrorView() {
  function throwError() {
    throw new Error('This is a test error message.')
  }

  return (
    <p style={{ color: 'red' }}>
      This is a test error page.{' '}
      <button onClick={throwError}>Throw an error</button>
    </p>
  )
}

export default TestErrorView
