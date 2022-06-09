import { useEffect, useRef, useState } from 'react'

export default function useTimeCounter(delay) {
  const [intervalCount, setIntervalCount] = useState(0)
  const countRef = useRef(null)

  useEffect(() => {
    countRef.current = setInterval(() => {
      setIntervalCount((c) => c + 1)
    }, delay)
    return () => clearInterval(countRef.current)
  }, [intervalCount, delay])

  return intervalCount
}
