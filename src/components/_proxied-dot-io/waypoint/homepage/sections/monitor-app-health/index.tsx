import classNames from 'classnames'
import { useInView } from 'react-intersection-observer'
import Section, {
	SectionHeading,
	SectionDescription,
} from 'components/_proxied-dot-io/waypoint/homepage/section'
import GraphicSvg from './graphic'
import usePrefersReducedMotion from 'lib/hooks/usePrefersReducedMotion'
import s from './style.module.css'

interface SectionMonitorAppHealthProps {
	heading: string
	description: string
}

export default function SectionMonitorAppHealth({
	heading,
	description,
}: SectionMonitorAppHealthProps): JSX.Element {
	const prefersReducedMotion = usePrefersReducedMotion()
	const { ref, inView } = useInView({
		threshold: 0.5,
		triggerOnce: true,
	})
	return (
		<Section className={s.monitorAppHealth}>
			<div
				className={classNames(s.media, {
					[s.visible]: inView || prefersReducedMotion,
				})}
				ref={ref}
			>
				<GraphicSvg />
			</div>
			<div className={s.content}>
				<SectionHeading>{heading}</SectionHeading>
				<SectionDescription>{description}</SectionDescription>
			</div>
		</Section>
	)
}
