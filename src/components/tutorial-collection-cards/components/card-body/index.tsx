import TruncateMaxLines from 'components/truncate-max-lines'
import s from './card-body.module.css'

function CardBody({ text }: { text: string }) {
  return (
    <p className={s.body}>
      <TruncateMaxLines
        maxLines={3}
        lineHeight="var(--token-typography-body-100-line-height)"
      >
        {text}
      </TruncateMaxLines>
    </p>
  )
}

export { CardBody }
