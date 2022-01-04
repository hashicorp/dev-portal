import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import DevPopover from 'components/dev-popover'
import s from './style.module.css'

// TODO: double-checking the desired functionality & also not all cases are covered yet
const SidebarBackToLink: React.FC = () => {
  return (
    <DevPopover
      buttonClassName={s.popoverButton}
      title="Work in progress"
      note={
        <>
          We are still ironing out the functionality of this component and how
          it should behave on the various subpages for each product.
          <br />
          <br />
          We're also working on UI polish. You can{' '}
          <a href="https://www.figma.com/file/VD7ahvXuXWJApeGnhbW4hv/Dev-Portal?node-id=1498%3A43240">
            view the revised designs in Figma
          </a>
          .
        </>
      }
    >
      <div className={s.backToLink}>
        <IconArrowLeft16 className={s.icon} />
        <span>Back to [Page]</span>
      </div>
    </DevPopover>
  )
}

export default SidebarBackToLink
