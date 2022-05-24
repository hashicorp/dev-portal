import { useRef, MutableRefObject } from 'react'
import useRefocus from 'lib/hooks/use-refocus'
import toastOnCopy from 'views/product-downloads-view/components/downloads-section/toast-on-copy'

function TestPage() {
  const activatorRef: MutableRefObject<HTMLButtonElement> = useRef()
  const refocusActivator = useRefocus(activatorRef)

  function focusButton() {
    activatorRef?.current?.focus()
  }

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
        ref={activatorRef}
        onClick={() =>
          toastOnCopy(true, { prettyOSName: 'macOS' }, refocusActivator)
        }
      >
        Button that makes toast
      </button>
      <div>
        <p>Manually focusing the button seems to work.</p>
        <button onClick={() => focusButton()}>Manually focus button</button>
      </div>
      <h2>Update: might be working now?</h2>
      <div>
        <p>
          Update: previously did not have this working, now I think I&apos;ve
          managed to get things working. Have created a <code>useRefocus</code>{' '}
          hook that uses an internal refocus flag state, and a related effect,
          to make this work (where calling <code>focus()</code> directly did not
          seem to make things work)
        </p>
      </div>
    </>
  )
}

export default TestPage
