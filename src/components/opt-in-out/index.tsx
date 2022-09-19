import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'
import { IconSignOut16 } from '@hashicorp/flight-icons/svg-react/sign-out-16'
import Button from 'components/button'
import usePreloadNextDynamic from 'hooks/use-preload-next-dynamic'
import { safeAnalyticsTrack, safeGetSegmentId } from 'lib/analytics'
import { OptInOutProps } from './types'
import { PLATFORM_OPTIONS, postFormData } from './helpers'
import OptOutForm from './components/opt-out-form'
import { OptOutFormState } from './components/opt-out-form/types'

const Dialog = dynamic(() => import('components/dialog'))

export default function OptInOut({ platform, redirectPath }: OptInOutProps) {
	// fire toast, render button, etc
	const router = useRouter()

	const isDialogPreloaded = usePreloadNextDynamic(Dialog)

	const [showDialog, setShowDialog] = useState(false)
	const openDialog = () => setShowDialog(true)
	const closeDialog = () => setShowDialog(false)

	const optedIn = Cookies.get(PLATFORM_OPTIONS[platform].cookieKey)
	const url =
		redirectPath || PLATFORM_OPTIONS[platform].getRedirectPath(router.asPath)

	/**
	 * Handle opt out, which is passed to our opt out form,
	 * and is also used in our welcome toast.
	 */
	const handleOptOut = useCallback(
		async (state: OptOutFormState) => {
			await postFormData({
				segment_anonymous_id: safeGetSegmentId(),
				primary_opt_out_reason: state.optOutReason,
				details: state.optOutDetails,
				opt_out_page_url: new URL(
					router.asPath,
					__config.dev_dot.canonical_base_url
				).toString(),
			})
			safeAnalyticsTrack('Beta Opted Out', {
				bucket: platform,
			})
			Cookies.remove(PLATFORM_OPTIONS[platform].cookieKey)
			Cookies.remove(PLATFORM_OPTIONS[platform].cookieAnalyticsKey)
			window.location.assign(url)
		},
		[platform, url, router.asPath]
	)

	// Return early if not opted in
	if (optedIn !== 'true') {
		return null
	}

	return (
		<div>
			<Button
				color="tertiary"
				text="Leave Beta"
				icon={<IconSignOut16 />}
				iconPosition="trailing"
				onClick={openDialog}
			/>
			{isDialogPreloaded || showDialog ? (
				<Dialog
					onDismiss={closeDialog}
					isOpen={showDialog}
					label="Opt out form"
				>
					<OptOutForm
						onSubmit={handleOptOut}
						onDismiss={closeDialog}
						platform="learn"
					/>
				</Dialog>
			) : null}
		</div>
	)
}
