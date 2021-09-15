import s from './style.module.css'

function Placeholder({ children }) {
  return (
    <div className={s.root}>
      {children}
    </div>
  )
}

export default Placeholder
