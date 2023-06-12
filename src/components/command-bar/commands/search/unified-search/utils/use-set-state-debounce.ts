import { Dispatch, SetStateAction, useEffect } from 'react'

export function useSetStateDebounce<T>(
	setStateFn: Dispatch<SetStateAction<T>>,
	stateValue: T,
	timing: number
) {
	useEffect(() => {
		const typingDebounce = setTimeout(() => {
			setStateFn(stateValue)
		}, timing)
		return () => clearTimeout(typingDebounce)
	}, [stateValue, timing, setStateFn])
}
