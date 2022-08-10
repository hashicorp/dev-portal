import { useQueries, useQuery } from '@tanstack/react-query'
import { getAllTutorialsOptions } from 'lib/learn-client/types'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'

interface UseTutorialsOptions {
	fullContent?: getAllTutorialsOptions['fullContent']
	limit?: getAllTutorialsOptions['limit']
}

const useTutorials = (options?: UseTutorialsOptions) => {
	const { fullContent, limit } = options

	// Fetch all tutorials
	const { data: tutorials, ...restResult } = useQuery(
		['tutorials'],
		() => getAllTutorials({ limit, fullContent }),
		{
			staleTime: Infinity,
		}
	)

	// Prime each individual tutorial queries, both by id and slug
	const followUpQueries = []
	tutorials?.forEach((tutorial) => {
		const { id, slug } = tutorial
		const queryFn = () => tutorial
		const staleTime = Infinity
		followUpQueries.push({
			queryKey: ['tutorial', id],
			queryFn,
			staleTime,
		})
		followUpQueries.push({
			queryKey: ['tutorial', slug],
			queryFn,
			staleTime,
		})
	})
	useQueries({
		queries: followUpQueries,
	})

	return {
		tutorials,
		...restResult,
	}
}

export { useTutorials }
