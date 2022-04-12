import sSidebar from 'components/sidebar/sidebar.module.css'

interface SidebarTitleHeadingProps {
  id: string
  text: string
}

const SidebarTitleHeading = ({ id, text }: SidebarTitleHeadingProps) => {
  return (
    <h2 className={sSidebar.title} id={id}>
      {text}
    </h2>
  )
}

export default SidebarTitleHeading
