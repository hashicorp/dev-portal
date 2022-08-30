import {
	TutorialProgressLabel,
	TutorialProgressPercent,
} from 'lib/learn-client/types'
import { progressPercentToLabel, progressLabelToPercent } from '../formatting'

describe('formatting', () => {
	it('converts from API percent to Dev Dot named progress state', () => {
		const expectedResults: Record<
			TutorialProgressPercent,
			TutorialProgressLabel
		> = {
			'0': TutorialProgressLabel.visited,
			'25': TutorialProgressLabel.in_progress,
			'50': TutorialProgressLabel.in_progress,
			'75': TutorialProgressLabel.in_progress,
			'90': TutorialProgressLabel.in_progress,
			'100': TutorialProgressLabel.complete,
		}
		Object.entries(expectedResults).forEach(
			(entry: [TutorialProgressPercent, TutorialProgressLabel]) => {
				const [apiPercentValue, expectedState] = entry
				const progressState = progressPercentToLabel(apiPercentValue)
				expect(progressState).toBe(expectedState)
			}
		)
	})

	it('converts from Dev Dot name progress state to API percent', () => {
		const expectedResults: Record<
			TutorialProgressLabel,
			TutorialProgressPercent
		> = {
			visited: TutorialProgressPercent.Zero,
			in_progress: TutorialProgressPercent.Fifty,
			complete: TutorialProgressPercent.OneHundred,
		}
		Object.entries(expectedResults).forEach(
			(entry: [TutorialProgressLabel, TutorialProgressPercent]) => {
				const [progressLabel, expectedPercent] = entry
				const progressPercent = progressLabelToPercent(progressLabel)
				expect(progressPercent).toBe(expectedPercent)
			}
		)
	})
})
