import s from 'components/sidebar/sidebar.module.css'

interface SidebarSectionHeadingProps {
  text: string
}

const SidebarSectionHeading = ({ text }: SidebarSectionHeadingProps) => {
  return <h3 className={s.heading}>{text}</h3>
}

export default SidebarSectionHeading
