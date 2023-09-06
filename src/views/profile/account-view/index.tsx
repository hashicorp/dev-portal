/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import AuthenticatedView from 'views/authenticated-view'
import Text from 'components/text'
import Heading from 'components/heading'

import { ProfileSidebar } from '../sidebar'
import s from './account-view.module.css'
import useAuthentication from 'hooks/use-authentication'
import CopySnippet from 'components/hds-copy-snippet'
import Card from 'components/card'

export default function ProfileAccountView() {
	return (
		<AuthenticatedView>
			<SidebarSidecarLayout
				breadcrumbLinks={[
					{ title: 'Developer', url: '/' },
					{
						title: 'Account',
						url: '/profile/account',
						isCurrentPage: true,
					},
				]}
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

			<Card className={s.section}>
				<Heading level={2} weight="bold" size={300}>
					Name
				</Heading>
				<Text className={s.description}>Your name</Text>
				<CopySnippet textToCopy={user?.name} />
			</Card>

			<Card className={s.section}>
				<Heading level={2} weight="bold" size={300}>
					HashiCorp ID
				</Heading>
				<Text className={s.description}>Your ID within HashiCorp</Text>
				<CopySnippet textToCopy={user?.id} />
			</Card>

			<div style={{ height: 24 }} />
		</div>
	)
}
