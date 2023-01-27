import classNames from 'classnames'
import Heading, { HeadingProps } from 'components/heading'
import { AutosizedHeadingBlockProps } from './types'
import s from './autosized-heading-block.module.css'

const AutosizedHeadingBlock = ({
	className,
	id,
	level,
	text,
}: AutosizedHeadingBlockProps) => {
	const levelsToSize = {
		2: 400,
		3: 300,
	}
	const classes = classNames(s.root, s[`h${level}`], className)

	return (
		<Heading
			className={classes}
			id={id}
			level={level}
			size={levelsToSize[level] as HeadingProps['size']}
			weight="bold"
		>
			{text}
		</Heading>
	)
}

export type { AutosizedHeadingBlockProps }
export { AutosizedHeadingBlock }
