/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Features, {
	FeaturesProps,
} from 'components/_proxied-dot-io/waypoint/homepage/features'
import InlineSvg from '@hashicorp/react-inline-svg'
import Button from '@hashicorp/react-button'
import NumberedBlock from 'components/_proxied-dot-io/waypoint/homepage/numbered-block'
import Editor from 'components/_proxied-dot-io/waypoint/homepage/editor'
import s from './style.module.css'

interface ConfigureYourAppProps {
	heading: string
	features: FeaturesProps
	code: string
	codeNote: string
}

export default function ConfigureYourApp({
	heading,
	features,
	code,
	codeNote,
}: ConfigureYourAppProps): JSX.Element {
	return (
		<div className={s.root}>
			<div className={s.content}>
				<NumberedBlock index="1" heading={heading}>
					<Features items={features} />
					<div className={s.contentExtra}>
						<InlineSvg
							className={s.logos}
							src={require('./logos.svg?include')}
						/>
						<Button
							url="https://github.com/hashicorp/waypoint-examples"
							title="View Waypoint examples on Github"
							theme={{
								variant: 'tertiary-neutral',
							}}
							linkType="inbound"
						/>
					</div>
				</NumberedBlock>
			</div>
			<div className={s.media}>
				<Editor code={code} note={codeNote} />
			</div>
		</div>
	)
}
