import classNames from 'classnames'
import s from './sidebar-horizontal-rule.module.css'

const SidebarHorizontalRule = ({ className }: { className?: string }) => {
	return <hr className={classNames(s.root, className)} />
}

export default SidebarHorizontalRule
