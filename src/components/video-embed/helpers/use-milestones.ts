import { useMemo } from 'react'

export function useMilestones(
  value: number,
  milestones: number[]
): number | null {
  return useMemo(() => getMaxMilestone(value, milestones), [value, milestones])
}

/**
 * Given a number value,
 * and an array of number milestones,
 * Return the greatest milestone that is less than or equal to the value,
 * or return null if the all milestones are greater than the value.
 */
export function getMaxMilestone(
  value: number,
  milestones: number[]
): number | null {
  return milestones.reduce(
    (acc: number | null, m: number) => (value >= m ? m : acc),
    null
  )
}
