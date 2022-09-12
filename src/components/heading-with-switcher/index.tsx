import DocsVersionSwitcher from 'components/docs-version-switcher'
import { HeadingWithSwitcherProps } from './types'
import s from './heading-with-switcher.module.css'
import Heading from 'components/heading'

const HeadingWithSwitcher = ({
	versions,
	...rest
}: HeadingWithSwitcherProps) => {
	return (
		<div className={s.root}>
			<div className={s.versionSwitcherWrapper}>
				<DocsVersionSwitcher options={versions} />
			</div>
			<Heading
				{...rest}
				level={1}
				className={s.heading}
				size={500}
				weight="bold"
			/>
		</div>
	)
}

export default HeadingWithSwitcher
