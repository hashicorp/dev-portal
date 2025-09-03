import classNames from 'classnames'
import s from './style.module.css'

interface Key {
	label: string
	color: string
}

interface LegendProps {
	className?: string
	keys: Array<Key>
}

export default function Legend({ keys, className }: LegendProps) {
	return (
		<div className={classNames(s.legend, className)}>
			<div className={s.keyWrapper}>
				{keys.map(({ label, color }: Key) => {
					return (
						<div className={s.key} key={label}>
							<div className={s.dot} style={{ background: color }} />
							<span className={s.name}>{label}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
