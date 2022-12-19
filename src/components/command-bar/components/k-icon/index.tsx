import InlineSvg from '@hashicorp/react-inline-svg'
import s from './k-icon.module.css'

const KIcon = () => {
	return <InlineSvg className={s.root} src={require('./k.svg?include')} />
}

export { KIcon }
