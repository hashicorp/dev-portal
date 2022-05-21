import { useEffect, useState, MutableRefObject } from 'react'

export default function useRefocus(refToFocus: MutableRefObject<HTMLElement>) {
  const [refocusFlag, setRefocusFlag] = useState<number>()

  function flagRefocus() {
    // Focusing directly does not seem to work
    // refToFocus?.current?.focus()
    // Using a flag and paired effect does seem to work
    setRefocusFlag(Date.now())
  }

  useEffect(() => {
    if (refocusFlag) {
      refToFocus?.current?.focus()
    }
  }, [refToFocus, refocusFlag])

  return flagRefocus
}
