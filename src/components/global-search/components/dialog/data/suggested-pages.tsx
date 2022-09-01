import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'

const suggestedPages = {
	boundary: [
		{
			icon: <IconDocs16 />,
			text: 'Boundary Documentation',
			url: '/boundary/docs',
		},
		{
			icon: <IconDownload16 />,
			text: 'Boundary Install',
			url: '/boundary/downloads',
		},
		{
			icon: <IconLearn16 />,
			text: 'Boundary Tutorials',
			url: '/boundary/tutorials',
		},
		{
			icon: <IconDocs16 />,
			text: 'HCP Boundary',
			// TODO
			url: '/hcp/docs/boundary/how-boundary-works',
		},
		{
			icon: <IconDocs16 />,
			text: 'Connect to Your First Target',
			url: '/boundary/docs/getting-started/connect-to-target',
		},
		{
			icon: <IconDocs16 />,
			text: 'Concepts',
			url: '/boundary/docs/concepts',
		},
		{
			icon: <IconGuide16 />,
			text: 'Tutorial Library',
			// TODO
			url: '/tutorial-library',
		},
	],
	consul: [],
	hcp: [],
	nomad: [],
	packer: [],
	terraform: [],
	vagrant: [],
	vault: [],
	waypoint: [],
}

export default suggestedPages
