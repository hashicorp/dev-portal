import IconTile from 'components/icon-tile'

interface IconTileLogoProps {
  product:
    | 'boundary'
    | 'consul'
    | 'nomad'
    | 'packer'
    | 'terraform'
    | 'vagrant'
    | 'vault'
    | 'waypoint'
    | 'hcp'
}

function IconTileLogo({ product }: IconTileLogoProps): React.ReactElement {
  return (
    <IconTile
      size="extra-large"
      icon={`${product}-color`}
      forceIconColor={false}
      brandColor={product == 'hcp' ? 'neutral' : product}
    />
  )
}

export default IconTileLogo
