import DevPopover from 'components/dev-popover'
import { IconSlashSquare16 } from '@hashicorp/flight-icons/svg-react/slash-square-16'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import classNames from 'classnames'
import s from './header-search-input.module.css'

interface HeaderSearchInputProps {
  theme?: 'light' | 'dark'
}

function HeaderSearchInput({
  theme = 'light',
}: HeaderSearchInputProps): React.ReactElement {
  return (
    <DevPopover
      title="Work in progress"
      note={
        <>
          For initial launch, search will be scoped by product. Search
          functionality will match existing behavior. For example, see{' '}
          <a href="https://www.waypointproject.io/docs">Waypoint&apos;s docs</a>
          .<br />
          <br />
          We&apos;re also working on UI polish. You can{' '}
          <a href="https://www.figma.com/file/VD7ahvXuXWJApeGnhbW4hv/Dev-Portal?node-id=1498%3A43240">
            view the revised designs in Figma
          </a>
          .
        </>
      }
    >
      <div className={classNames(s.headerSearchInput, s[`theme-${theme}`])}>
        <div>
          <IconSearch16 className={s.searchIcon} />
          <p>Search</p>
        </div>
        <IconSlashSquare16 className={s.slashIcon} />
      </div>
    </DevPopover>
  )
}

export default HeaderSearchInput
