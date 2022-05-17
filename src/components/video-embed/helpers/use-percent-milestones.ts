import { useState, useEffect } from 'react'

export function usePercentMilestones(
  percentDone: number,
  milestones: number[]
) {
  const [milestonesReached, setMilestonesReached] = useState<
    { p: number; reached: boolean }[]
  >(milestones.map((p) => ({ p, reached: false })))

  // the highest percentMilestone we've reached so far
  const maxMilestoneReached = milestonesReached.reduce(
    (acc, { p, reached }) => {
      return reached ? p : acc
    },
    0
  )

  useEffect(() => {
    setMilestonesReached((prev) =>
      prev.map(({ p }) => {
        return { p, reached: p <= percentDone }
      })
    )
  }, [percentDone])

  return maxMilestoneReached
}
