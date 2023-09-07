/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import AuthenticatedView from 'views/authenticated-view'
import Text from 'components/text'
import Heading from 'components/heading'

import { ProfileSidebar } from '../sidebar'
import s from './account-view.module.css'
import useAuthentication from 'hooks/use-authentication'
import CopySnippet from 'components/hds-copy-snippet'
import Card from 'components/card'
import StandaloneLink from 'components/standalone-link'

export default function ProfileAccountView() {
	return (
		<AuthenticatedView>
			<SidebarSidecarLayout
				AlternateSidebar={ProfileSidebar}
				sidebarNavDataLevels={[]}
			>
				<ProfileAccountViewContent />
			</SidebarSidecarLayout>
		</AuthenticatedView>
	)
}

const ProfileAccountViewContent = () => {
	const { user } = useAuthentication()

	return (
		<div>
			<Heading level={1} weight="bold" size={500}>
				Account
			</Heading>
			<Text className={s.subheading}>
				A read-only view of personal account info from&nbsp;
				<a href="https://portal.cloud.hashicorp.com/account-settings">
					HCP Account settings
				</a>
			</Text>

			<Heading level={2} weight="bold" size={200} className={s.sectionTitle}>
				Email
			</Heading>

			<Card className={s.section} elevation="mid">
				<Text className={s.description}>
					Email address associated with your profile name
				</Text>
				<div className={s.copySnippetWrapper}>
					<CopySnippet textToCopy={user?.email} />
				</div>
			</Card>

			<Heading level={2} weight="bold" size={200} className={s.sectionTitle}>
				HashiCorp ID
			</Heading>

			<Card className={s.section} elevation="mid">
				<Text className={s.description}>Your ID within HashiCorp</Text>
				<div className={s.copySnippetWrapper}>
					<CopySnippet textToCopy={user?.id} />
				</div>
			</Card>

			<StandaloneLink
				href={'https://portal.cloud.hashicorp.com/account-settings'}
				text={'Manage account settings'}
				icon={<IconExternalLink16 />}
				iconPosition="trailing"
			/>
		</div>
	)
}
