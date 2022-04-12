import s from './sidebar-section-heading.module.css'

interface SidebarSectionHeadingProps {
  text: string
}

const SidebarSectionHeading = ({ text }: SidebarSectionHeadingProps) => {
  return <h3 className={s.root}>{text}</h3>
}

export default SidebarSectionHeading
