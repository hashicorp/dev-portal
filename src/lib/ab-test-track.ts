import { canTrackAnalytics } from 'lib/analytics'

export const abTestTrack = ({
	type,
	test_name,
	variant,
}: {
	type: 'Served' | 'Result'
	test_name: string
	variant: string
}) => {
	if (canTrackAnalytics()) {
		window.analytics.track(`AB Test ${type}`, {
			test_name,
			variant,
		})
	}
}
