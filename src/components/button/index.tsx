import s from './button.module.css'
import { ButtonProps } from './types'

const Button = ({ onClick, text, type = 'button' }: ButtonProps) => {
  return (
    <button className={s.root} onClick={onClick} type={type}>
      {text}
    </button>
  )
}

export type { ButtonProps }
export default Button
