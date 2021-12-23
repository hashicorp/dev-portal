import Link from 'next/link'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import useCurrentPath from 'hooks/use-current-path'
import s from './style.module.css'

const subpagesToTitles = {
  docs: 'Reference Docs',
  commands: 'CLI',
  plugins: 'Plugins',
}

// TODO: double-checking the desired functionality & also not all cases are covered yet
const SidebarBackToLink: React.FC = () => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const currentPathSplit = currentPath.split('/')
  const currentProductSlug = currentPathSplit[1]
  const currentProductSubpage = currentPathSplit[2]
  const backToPath = `/${currentProductSlug}/${currentProductSubpage}`

  return (
    <Link href={backToPath}>
      <a className={s.backToLink}>
        <IconArrowLeft16 className={s.icon} />
        <span>Back to {subpagesToTitles[currentProductSubpage]}</span>
      </a>
    </Link>
  )
}

export default SidebarBackToLink
