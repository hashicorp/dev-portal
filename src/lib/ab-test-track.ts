import { track } from '@hashicorp/platform-analytics'

export const abTestTrack = ({
	type,
	test_name,
	variant,
}: {
	type: 'Served' | 'Result'
	test_name: string
	variant: string
}) => {
	track(`AB Test ${type}`, {
		test_name,
		variant,
	})
}
