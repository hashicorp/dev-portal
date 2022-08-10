import { useQuery } from '@tanstack/react-query'
import { ApiTutorial } from 'lib/learn-client/api/api-types'
import { getTutorial } from 'lib/learn-client/api/tutorial'

const useTutorial = (identifier: ApiTutorial['id'] | ApiTutorial['slug']) => {
	const { data: tutorial, ...restQueryResult } = useQuery(
		['tutorial', identifier],
		() => getTutorial(identifier),
		{ staleTime: Infinity }
	)

	return { tutorial, ...restQueryResult }
}

export { useTutorial }
