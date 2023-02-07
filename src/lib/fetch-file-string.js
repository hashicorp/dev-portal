async function fetchFileString(url) {
	const res = await fetch(url)
	return res.text()
}

module.exports = fetchFileString
