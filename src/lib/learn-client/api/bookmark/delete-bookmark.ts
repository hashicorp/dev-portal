import { ApiTutorial } from 'lib/learn-client/api/api-types'
import { destroy, toError } from 'lib/learn-client'
import { errorDevelopmentToast } from 'components/toast'
import { BOOKMARK_API_ROUTE } from '.'

/**
 * Removes a bookmark using the /bookmarks/:tutorialId DELETE endpoint.
 */
const deleteBookmark = async ({
	tutorialId,
	token,
}: {
	tutorialId: ApiTutorial['id']
	token: string
}) => {
	// Make the DELETE request
	const requestResult = await destroy(
		`${BOOKMARK_API_ROUTE}/${tutorialId}`,
		token
	)

	// Return the result as JSON if the request status is OK
	if (requestResult.ok) {
		const { result } = await requestResult.json()
		return result
	}

	// Render an error development toast request status is not OK
	// TODO - log to Datadog
	const error = await toError(requestResult)
	errorDevelopmentToast('Error in `deleteBookmark`', error.toString())
}

export { deleteBookmark }
