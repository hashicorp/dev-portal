import { useEffect, useRef, useState } from 'react'
import { animated } from '@react-spring/web'
import { ComputedDatum, DefaultRawDatum } from '@nivo/pie'
import { ArcLinkLabelComponent } from '@nivo/arcs'
import s from './styles.module.css'

const FOREIGN_OBJECT_WIDTH = 180

export const useRenderArcLinkLabelComponent: typeof ArcLinkLabelComponent<
	ComputedDatum<DefaultRawDatum>
> = (d) => {
	const lockupRef = useRef<HTMLDivElement>(null)
	const [foreignObjectHeight, setForeignObjectHeight] = useState(0)

	useEffect(() => {
		if (lockupRef.current) {
			setForeignObjectHeight(lockupRef.current.offsetHeight)
		}
	}, [])

	return (
		<animated.g opacity={d.style.opacity}>
			<animated.path
				fill="none"
				d={d.style.path}
				stroke={d.style.linkColor}
				strokeWidth={d.style.thickness}
			/>
			<animated.g
				transform={d.style.textPosition}
				textAnchor={d.style.textAnchor}
				className={s.containerWrapper}
			>
				<g
					className={s.container}
					style={{
						['--container-width' as string]: `${FOREIGN_OBJECT_WIDTH}px`,
						['--container-height' as string]: `${foreignObjectHeight}px`,
					}}
				>
					<foreignObject
						dominantBaseline="central"
						width={FOREIGN_OBJECT_WIDTH}
						height={foreignObjectHeight}
					>
						<div ref={lockupRef} className={s.lockup}>
							<div className={s.value}>{d.datum.value}%</div>
							<div className={s.label}>{d.datum.label}</div>
						</div>
					</foreignObject>
				</g>
			</animated.g>
		</animated.g>
	)
}
