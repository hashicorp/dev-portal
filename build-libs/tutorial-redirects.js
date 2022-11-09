async function getTutorialRedirects() {
	const url = new URL(
		'/pages/redirects',
		process.env.NEXT_PUBLIC_LEARN_API_BASE_URL
	)
	const res = await fetch(url, {
		method: 'GET',
	})

	if (res.ok) {
		const redirects = await res.json()
		console.log(redirects.result)
		return JSON.parse(redirects.result.page_data.redirectsData)
	}

	if (res.status === 404) {
		console.log('Redirects page not found')
		return []
	}

	throw new Error(`Error: ${res.status} ${res.statusText}`)
}

module.exports = { getTutorialRedirects }
