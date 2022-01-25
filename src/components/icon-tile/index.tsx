import { useMemo } from 'react'
import s from './style.module.css'
import classNames from 'classnames'

interface IconTileProps {
  icon: string
  /** Note: the "extra-large" option is not documented in the design system. It's being used on the /{product} view pages. */
  size: 'small' | 'medium' | 'large' | 'extra-large'
  brandColor?: string
  forceIconColor?: boolean
}

function IconTile({
  icon,
  size = 'medium',
  brandColor = 'neutral',
  forceIconColor = true,
}: IconTileProps): React.ReactElement {
  const flightImportPath = `${icon}-${size == 'small' ? 16 : 24}`

  const IconSvg = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const svgModule = require(`@hashicorp/flight-icons/svg-react/${flightImportPath}`)
      return svgModule[Object.keys(svgModule)[0]]
    } catch (e) {
      console.error(e)
      return () => null
    }
  }, [flightImportPath])

  return (
    <span
      className={classNames(
        s.root,
        s[`size-${size}`],
        s[`color-${brandColor}`],
        { [s.forceIconColor]: forceIconColor }
      )}
    >
      <IconSvg />
    </span>
  )
}

export default IconTile
