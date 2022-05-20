import { useEffect, useState, useRef, MutableRefObject } from 'react'
import toastOnCopy from 'views/product-downloads-view/components/downloads-section/toast-on-copy'

function TestPage() {
  const buttonRef: MutableRefObject<HTMLButtonElement> = useRef()
  const [isDismissed, setIsDismissed] = useState<boolean>(false)

  function onDismissCallback() {
    console.log({ called: 'onDismissCallback' })
    focusButton()
    // setIsDismissed(true)
  }

  function focusButton() {
    console.log({ buttonRefToFocus: buttonRef.current })
    console.log('Calling buttonRef.current.focus()...')
    buttonRef.current.focus()
  }

  useEffect(() => {
    if (isDismissed) {
      focusButton()
    }
  }, [isDismissed])

  console.log('Rendering the TestPage component...')

  return (
    <>
      <h1>Interactive Toast Test</h1>
      <h2>Intent</h2>
      <ul>
        <li>
          Clicking a button opens an interactive toast, which has a{' '}
          <code>dialog</code> role, and receives (and captures) focus
        </li>
        <li>
          When that interactive toast is dismissed, focus should return to the
          element clicked. In this case, our placeholder button.
        </li>
      </ul>
      <h2>What I&apos;ve Tried</h2>
      <button
        ref={buttonRef}
        onClick={() => toastOnCopy(true, 'macOS', onDismissCallback)}
      >
        Button that makes toast
      </button>
      <div>
        <p>Manually focusing the button seems to work.</p>
        <button onClick={() => focusButton()}>Manually focus button</button>
      </div>
      <div>
        <p>
          Focusing the button in useEffect, when isDismissed changes to true,
          seems to work too.
        </p>
        <pre>
          <code>{JSON.stringify({ isDismissed }, null, 2)}</code>
        </pre>
        <button onClick={() => setIsDismissed(!isDismissed)}>
          set isDismissed to {`"${String(!isDismissed)}"`}
        </button>
      </div>
      <div>
        <p>
          But focusing the button in a callback after toast is dismissed does
          not seem to work. I&apos;ve tried:
        </p>
        <ul>
          <li>Focusing the button directly</li>
          <li>
            Setting isDismissed to true, which should trigger a focus change
            through an effect
          </li>
        </ul>
        <p>
          Have seen some use of <code>shouldFocus</code> refs and{' '}
          <code>useLayoutEffect</code> elsewhere, so I figure this is more of a
          lack of React internals knowledge than anything else.
        </p>
      </div>
    </>
  )
}

export default TestPage
