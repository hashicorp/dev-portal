import {
	TutorialProgressStatus,
	TutorialProgressPercent,
} from 'lib/learn-client/types'
import { progressPercentToStatus, progressStatusToPercent } from '../formatting'

describe('formatting', () => {
	it('converts from API percent to Dev Dot named progress state', () => {
		const expectedResults: Record<
			TutorialProgressPercent,
			TutorialProgressStatus
		> = {
			'0': TutorialProgressStatus.visited,
			'25': TutorialProgressStatus.in_progress,
			'50': TutorialProgressStatus.in_progress,
			'75': TutorialProgressStatus.in_progress,
			'90': TutorialProgressStatus.in_progress,
			'100': TutorialProgressStatus.complete,
		}
		Object.entries(expectedResults).forEach(
			(entry: [TutorialProgressPercent, TutorialProgressStatus]) => {
				const [apiPercentValue, expectedState] = entry
				const progressState = progressPercentToStatus(apiPercentValue)
				expect(progressState).toBe(expectedState)
			}
		)
	})

	it('converts from Dev Dot name progress state to API percent', () => {
		const expectedResults: Record<
			TutorialProgressStatus,
			TutorialProgressPercent
		> = {
			visited: TutorialProgressPercent.Zero,
			in_progress: TutorialProgressPercent.Fifty,
			complete: TutorialProgressPercent.OneHundred,
		}
		Object.entries(expectedResults).forEach(
			(entry: [TutorialProgressStatus, TutorialProgressPercent]) => {
				const [progressLabel, expectedPercent] = entry
				const progressPercent = progressStatusToPercent(progressLabel)
				expect(progressPercent).toBe(expectedPercent)
			}
		)
	})
})
