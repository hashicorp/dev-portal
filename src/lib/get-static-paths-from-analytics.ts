interface BaseParams {
	[param: string]: string[]
}

type StaticPaths<Params = BaseParams> = {
	params: Params
}[]

interface GetStaticPathsFromAnalyticsOptions<Params = BaseParams> {
	/**
	 * The path parameter used for your dynamic route. For example, if your page file is called [[...page]], this should be `page`. (defaults to: `page`)
	 */
	param?: string

	/**
	 * The maximum number of paths to be returned. The actual number of paths returned may be less depending on the number of paths with analytics data
	 */
	limit?: number

	/**
	 * The path prefix to filter by. Example, if the dynamic route is /waypoint/docs/[[...page]], this value should be `/waypoint/docs/`
	 */
	pathPrefix: string

	/**
	 * An array of valid static paths to cross-check against. This is used to ensure that all paths returned from analytics data are valid
	 */
	validPaths?: StaticPaths<Params>
}

/**
 * Uses our static_paths endpoint to collect the most popular paths for a given subpath. If `validPaths` are provided, the result from
 * the analytics data will be cross-checked against it. This ensure that no invalid paths from our analytics data might be included, be it
 * non-existent pages or pages for another dynamic route.
 */
export async function getStaticPathsFromAnalytics<Params = BaseParams>({
	param = 'page',
	limit,
	pathPrefix,
	validPaths,
}: GetStaticPathsFromAnalyticsOptions<Params>): Promise<StaticPaths<Params>> {
	const endpoint = new URL(
		`/api/static_paths?product=developer&param=${param}&limit=${limit}&path_prefix=${pathPrefix}`,
		process.env.MKTG_CONTENT_API
	)

	const { result } = await fetch(endpoint.toString()).then((res) => res.json())

	const pathsFromAnalytics: StaticPaths<Params> = result?.paths ?? []

	if (validPaths) {
		// cross-check paths from analytics against those from nav data to ensure we aren't returning invalid paths
		const paths = pathsFromAnalytics.filter(({ params }) => {
			// the params order is guaranteed to be consistent here as it represents a destructured path, so we can join and safely do an equality check
			const joinedParams = params?.[param]?.join?.('/')

			return validPaths.some(
				({ params: validPathParams }) =>
					validPathParams?.[param]?.join?.('/') === joinedParams
			)
		})

		return paths
	}

	return pathsFromAnalytics
}
