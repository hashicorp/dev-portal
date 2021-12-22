import Link from 'next/link'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import useCurrentPath from 'hooks/use-current-path'
import s from './style.module.css'

const subpagesToTitles = {
  docs: 'Reference Docs',
  commands: 'CLI',
  plugins: 'Plugins',
}

const SidebarBackToLink: React.FC = () => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const currentPathSplit = currentPath.split('/')
  const currentProductSlug = currentPathSplit[1]
  const currentProductSubpage = currentPathSplit[2]
  const backToPath = `/${currentProductSlug}/${currentProductSubpage}`

  console.log(backToPath === currentPath)

  return (
    <Link href={backToPath}>
      <a
        className={s.backToLink}
        style={{
          visibility: backToPath === currentPath ? 'hidden' : 'visible',
        }}
      >
        <IconArrowLeft16 className={s.icon} />
        <span>Back to {subpagesToTitles[currentProductSubpage]}</span>
      </a>
    </Link>
  )
}

export default SidebarBackToLink
