const getIsUserAgentMacOs = () => {
	if (typeof window === 'undefined') {
		return false
	}

	const userAgent = window.navigator.userAgent
	return userAgent.toLowerCase().includes('mac')
}

export { getIsUserAgentMacOs }
