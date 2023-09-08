import { useState, useEffect } from 'react'
import { IconWand24 } from '@hashicorp/flight-icons/svg-react/wand-24'

import { toast, ToastColor } from 'components/toast'
import useAuthentication from 'hooks/use-authentication'

// TODO(kevinwang): see `make-dark-mode-notification.ts` for persistent-hiding
export function AIFeatureToast() {
	const [shown, setShown] = useState(false)
	const { session } = useAuthentication()
	useEffect(() => {
		if (shown) {
			return
		}

		if (session?.meta.isAIEnabled) {
			toast({
				color: ToastColor.highlight,
				icon: <IconWand24 />,
				title: 'Welcome to the Developer AI closed beta',
				description: 'Try it out in our cmd+K menu!',
				autoDismiss: 10000,
			})
			setShown(true)
		}
	}, [session?.meta.isAIEnabled, shown])
	return null
}
