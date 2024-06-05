/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconSupport24 } from '@hashicorp/flight-icons/svg-react/support-24'
import { IconHelp24 } from '@hashicorp/flight-icons/svg-react/help-24'
import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import slugify from 'slugify'
import Heading from 'components/heading'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import { PreFooterIconSlug, PreFooterAction, PreFooterProps } from './types'
import s from './pre-footer.module.css'

function PreFooterIcon({ slug }: { slug: PreFooterIconSlug }) {
	switch (slug) {
		case 'support':
			return <IconSupport24 color="var(--token-color-foreground-highlight)" />
		case 'user':
			return <IconUser24 color="var(--token-color-nomad-brand)" />
		case 'help':
		default:
			return <IconHelp24 color="var(--token-color-packer-brand)" />
	}
}

function PreFooter({ heading, description, actions }: PreFooterProps) {
	return (
		<section className={s.preFooter}>
			<div className={s.container}>
				<div className={s.content}>
					<Heading level={2} size={500} weight="bold" id={heading}>
						{heading}
					</Heading>
					<Text className={s.description}>{description}</Text>
				</div>
				<div className={s.actions}>
					<ul className={s.actionsList}>
						{actions.map((action: PreFooterAction) => {
							return (
								<li className={s.actionsListItem} key={slugify(action.heading)}>
									<span className={s.actionsIcon}>
										<PreFooterIcon slug={action.icon} />
									</span>
									<div>
										<Heading
											level={2}
											size={300}
											weight="bold"
											className={s.actionsHeading}
										>
											{action.heading}
										</Heading>
										<StandaloneLink
											className={s.actionsDescription}
											color="secondary"
											href={action.link}
											icon={<IconExternalLink16 />}
											iconPosition="trailing"
											text={action.description}
											opensInNewTab
										/>
									</div>
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</section>
	)
}

export { PreFooter, PreFooterIcon }
