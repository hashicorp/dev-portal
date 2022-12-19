import Text from 'components/text'
import s from './mdx-p.module.css'

function MdxP(props) {
	return <Text {...props} className={s.p} />
}

export { MdxP }
