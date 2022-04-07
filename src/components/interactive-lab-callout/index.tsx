import Image from 'next/image'
import Button from 'components/button'
import Card from 'components/card'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import s from './interactive-lab-callout.module.css'

export default function InteractiveLabCallout() {
  const ctx = useInstruqtEmbed()

  if (!ctx.labId) {
    return null
  }

  return (
    <Card className={s.interactiveCallout} elevation="low">
      <div>
        <p className={s.title}>Launch Terminal</p>
        <p className={s.description}>
          This tutorial includes a free interactive command-line lab that lets
          you follow along on actual cloud infrastructure.
        </p>
        <div className={s.ctaButton}>
          <Button
            // TODO: <Button /> within dev-dot does not take "data-heap-track".
            // Will handle in follow-up PR.
            // https://app.asana.com/0/1201987349274776/1202096857327389/f
            data-heap-track="InteractiveCalloutButton"
            color="secondary"
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
    </Card>
  )
}
