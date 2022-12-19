import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import { TutorialLite, TutorialProgressPercent } from 'lib/learn-client/types'
import { getNextTutorial } from '../parse-collection-progress'

describe('getNextTutorial', () => {
	it('if there is no progress data, returns the first tutorial', () => {
		const tutorials = [
			{
				id: 'first-tutorial',
			},
			{
				id: 'second-tutorial',
			},
		] as TutorialLite[]
		const progressData = [] as ApiCollectionTutorialProgress[]
		const result = getNextTutorial({
			isCompleted: false,
			tutorials,
			progressData,
		})
		expect(result.id).toBe('first-tutorial')
	})

	it('if there are no in-progress tutorials, returns the first incomplete tutorial, skipping completed tutorials', () => {
		const tutorials = [
			{
				id: 'first-tutorial',
			},
			{
				id: 'second-tutorial',
			},
		] as TutorialLite[]
		const progressData = [
			{
				tutorial_id: 'first-tutorial',
				complete_percent: TutorialProgressPercent.OneHundred,
			},
		] as ApiCollectionTutorialProgress[]
		const result = getNextTutorial({
			isCompleted: false,
			tutorials,
			progressData,
		})
		expect(result.id).toBe('second-tutorial')
	})

	it('if there are any in_progress tutorials, returns the first in_progress tutorial, skipping visited tutorials and tutorials without progress', () => {
		const tutorials = [
			{
				id: 'first-tutorial',
			},
			{
				id: 'second-tutorial',
			},
			{
				id: 'third-tutorial',
			},
			{
				id: 'fourth-tutorial',
			},
		] as TutorialLite[]
		const progressData = [
			{
				tutorial_id: 'first-tutorial',
				complete_percent: TutorialProgressPercent.OneHundred,
			},
			{
				tutorial_id: 'third-tutorial',
				complete_percent: TutorialProgressPercent.Zero,
			},
			{
				tutorial_id: 'fourth-tutorial',
				complete_percent: TutorialProgressPercent.Fifty,
			},
		] as ApiCollectionTutorialProgress[]
		const result = getNextTutorial({
			isCompleted: false,
			tutorials,
			progressData,
		})
		expect(result.id).toBe('fourth-tutorial')
	})

	it('if all tutorials are completed, returns the first tutorial', () => {
		const tutorials = [
			{
				id: 'first-tutorial',
			},
			{
				id: 'second-tutorial',
			},
			{
				id: 'third-tutorial',
			},
		] as TutorialLite[]
		const progressData = [
			{
				tutorial_id: 'first-tutorial',
				complete_percent: TutorialProgressPercent.OneHundred,
			},
			{
				tutorial_id: 'second-tutorial',
				complete_percent: TutorialProgressPercent.OneHundred,
			},
			{
				tutorial_id: 'third-tutorial',
				complete_percent: TutorialProgressPercent.OneHundred,
			},
		] as ApiCollectionTutorialProgress[]
		const result = getNextTutorial({
			isCompleted: false,
			tutorials,
			progressData,
		})
		expect(result.id).toBe('first-tutorial')
	})
})
