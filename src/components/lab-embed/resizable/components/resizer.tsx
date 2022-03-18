import ResizeBar from './img/resize_bar.svg?include'
import CloseIcon from '@hashicorp/flight-icons/svg/x-24.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'
import styles from './resizer.module.css'

interface ResizerProps {
  onMouseDown(e: React.MouseEvent): void
  onMouseUp?(e: React.MouseEvent): void
  onClosePanel?(boolean): void
  panelActive: boolean
  style: any
}

export default function Resizer({
  onMouseDown,
  onMouseUp,
  onClosePanel,
  panelActive,
  style = {},
}: ResizerProps) {
  return (
    <div
      className={styles.resizer}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={style}
    >
      <InlineSvg className={styles.resizeBar} src={ResizeBar} />
      <div
        className={styles.closeIcon}
        onClick={() => onClosePanel(!panelActive)}
      >
        <InlineSvg src={CloseIcon} />
      </div>
    </div>
  )
}
