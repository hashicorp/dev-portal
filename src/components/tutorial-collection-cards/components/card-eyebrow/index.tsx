import s from './card-eyebrow.module.css'

function CardEyebrow({ text, icon }: { text: string; icon?: JSX.Element }) {
  return (
    <span className={s.eyebrow}>
      {icon ? icon : null}
      {text}
    </span>
  )
}

export { CardEyebrow }
