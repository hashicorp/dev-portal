import s from './style.module.css'

function Placeholder({ name }) {
  return (
    <div className={s.root}>
      <p className={s.text}>{name}</p>
    </div>
  )
}

export default Placeholder
