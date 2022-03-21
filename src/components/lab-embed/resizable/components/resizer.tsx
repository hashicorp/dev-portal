import { Dispatch, SetStateAction } from 'react'
import CSS from 'csstype'
import CloseIcon from '@hashicorp/flight-icons/svg/x-24.svg?include'
import InlineSvg from '@hashicorp/react-inline-svg'
import ResizeBar from './img/resize_bar.svg?include'
import s from './resizer.module.css'

interface ResizerProps {
  onMouseDown(e: React.MouseEvent): void
  panelActive: boolean
  style: CSS.Properties
  onMouseUp?(e: React.MouseEvent): void
  onClosePanel?: Dispatch<SetStateAction<boolean>>
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
      className={s.resizer}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={style}
    >
      <InlineSvg className={s.resizeBar} src={ResizeBar} />
      <div className={s.closeIcon} onClick={() => onClosePanel(!panelActive)}>
        <InlineSvg src={CloseIcon} />
      </div>
    </div>
  )
}
