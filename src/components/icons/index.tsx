import classNames from 'classnames/bind'
import InlineSvg from '@hashicorp/react-inline-svg'
import s from './style.module.css'

interface IconProps {
  className?: string
  name: string
  size?: 16 | 24
}

const cx = classNames.bind(s)

const Icon: React.FC<IconProps> = ({ className, name, size = 16 }) => {
  const classes = cx('icon', {
    [className]: !!className,
  })

  return (
    <InlineSvg
      className={classes}
      src={require(`@hashicorp/flight-icons/svg/${name}-${size}.svg?include`)}
    />
  )
}

export default Icon
