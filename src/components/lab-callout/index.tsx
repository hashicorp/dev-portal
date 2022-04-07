import Image from 'next/image'
import Button from 'components/button'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import s from './interactive-lab-callout.module.css'

export default function InteractiveLabCallout() {
  const ctx = useInstruqtEmbed()

  if (!ctx.labId) {
    return null
  }

  return (
    <div className={s.interactiveCallout}>
      <div>
        <h2 className={s.title}>Launch Terminal</h2>
        <p className={s.description}>
          This tutorial includes a free interactive command-line lab that lets
          you follow along on actual cloud infrastructure.
        </p>
        <div className={s.ctaButton}>
          <Button
            // TODO: <Button /> within dev-dot does not take "data-heap-track"
            // Should we simply pass it along? Or is there some new analytics
            // thing that we intend to use?
            // data-heap-track="InteractiveCalloutButton"
            text="Start interactive lab"
            onClick={() => ctx.setActive(true)}
            size="small"
          />
        </div>
      </div>
      <div className={s.image}>
        <Image
          src={require('./img/interactive-callout-visual.png')}
          width={133}
          height={100}
          alt=""
          layout="responsive"
        />
      </div>
    </div>
  )
}
