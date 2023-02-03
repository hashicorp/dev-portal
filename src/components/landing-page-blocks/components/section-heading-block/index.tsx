import { AutosizedHeadingBlock } from '../autosized-heading-block'
import { SectionHeadingBlockProps } from './types'
import s from './section-heading-block.module.css'

const SectionHeadingBlock = ({ level, id, text }: SectionHeadingBlockProps) => {
	return (
		<AutosizedHeadingBlock
			className={s.root}
			id={id}
			level={level}
			text={text}
		/>
	)
}

export type { SectionHeadingBlockProps }
export { SectionHeadingBlock }
