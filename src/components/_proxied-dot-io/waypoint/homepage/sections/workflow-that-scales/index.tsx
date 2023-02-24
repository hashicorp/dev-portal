/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Section, {
	SectionHeading,
	SectionDescription,
} from 'components/_proxied-dot-io/waypoint/homepage/section'
import s from './style.module.css'

export default function SectionWorkflowThatScales() {
	return (
		<Section className={s.workflowThatScales}>
			<div className={s.heading}>
				<SectionHeading>One workflow that scales</SectionHeading>
			</div>
			<div className={s.description}>
				<SectionDescription>
					By creating one common workflow to enable developers to deploy; teams
					of every size can take advantage of Waypoint. Use plugins to
					automatically detect your tools, or for established projects, layer in
					your existing configuration like Dockerfiles and YAML.
				</SectionDescription>
			</div>
			<div className={s.media}>
				<img src={require('./img/workflow-that-scales.png')} alt="" />
			</div>
		</Section>
	)
}
