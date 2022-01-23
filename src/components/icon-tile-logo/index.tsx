import s from './style.module.css'

interface IconTileLogoProps {
  size?: 'small' | 'medium' | 'large'
  brandColor?: string
}

function IconTileLogo({
  size = 'medium',
  brandColor,
}: IconTileLogoProps): React.ReactElement {
  return <div className={s.root}>IconTile</div>
}

export default IconTileLogo
