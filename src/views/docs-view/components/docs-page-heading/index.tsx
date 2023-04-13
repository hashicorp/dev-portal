/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import DocsVersionSwitcher from 'components/docs-version-switcher'
import LandingHero from 'components/landing-hero'
import DocsPlainPageHeading from '../docs-plain-page-heading'
import s from './docs-page-heading.module.css'

function DocsPageHeading({
	asLandingHero,
	className,
	pageHeading,
	projectName,
	subtitle,
	versions,
}: {
	asLandingHero: boolean
	/** Optional className to set `margin` on the root element.  */
	className?: string
	pageHeading: { id: string; title: string }
	projectName?: string
	subtitle: string
	versions: $TSFixMe
}) {
	return (
		<div className={classNames(s.root, className)}>
			{versions ? (
				<div className={s.versionSwitcherWrapper}>
					<DocsVersionSwitcher options={versions} projectName={projectName} />
				</div>
			) : null}
			<div className={s.pageHeadingWrapper}>
				{asLandingHero ? (
					<LandingHero pageHeading={pageHeading} pageSubtitle={subtitle} />
				) : (
					<DocsPlainPageHeading id={pageHeading.id} title={pageHeading.title} />
				)}
			</div>
		</div>
	)
}

export default DocsPageHeading
