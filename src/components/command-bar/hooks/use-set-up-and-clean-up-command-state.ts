import { useEffect } from 'react'

/**
 * Utility hook for just running a given set up function on mount, and a clean
 * up function on unmount.
 *
 * Useful for cases when a command needs to set state when it's DialogBody is
 * rendered, since the state will likely need to be cleaned up on unmount of
 * DialogBody.
 *
 * Motivation is for this to serve as a reminder to do clean up so other
 * commands are unaffected by the state set up by a command.
 */
const useSetUpAndCleanUpCommandState = (
	setUpCommandState: () => void,
	cleanUpCommandState: () => void
) => {
	useEffect(() => {
		setUpCommandState()

		return () => cleanUpCommandState()
	}, [setUpCommandState, cleanUpCommandState])
}

export default useSetUpAndCleanUpCommandState
