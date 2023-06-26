import probe from 'probe-image-size'

export async function getImageDimensions(src: string) {
	if (!src.startsWith('http')) {
		return
	}

	try {
		return await probe(src)
	} catch (e) {
		if (e.statusCode === 404) {
			console.error(
				'[remarkPluginInjectImageDimensions] Image path not found, unable to calculate dimensions ' +
					e
			)
			return
		} else {
			throw e
		}
	}
}
