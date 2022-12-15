import classNames from 'classnames'
import Text from 'components/text'
import s from './mdx-p.module.css'

function MdxP(props) {
	const { className, ...restProps } = props
	return <Text {...restProps} className={classNames(s.p, className)} />
}

export { MdxP }
