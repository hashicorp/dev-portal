import s from './style.module.css'

interface IconTileProps {
  size?: 'small' | 'medium' | 'large'
  brandColor?: string
}

function IconTile({
  size = 'medium',
  brandColor,
}: IconTileProps): React.ReactElement {
  return <div className={s.root}>IconTile</div>
}

export default IconTile
