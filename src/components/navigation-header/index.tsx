import { ReactNode } from 'react'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import { NavigationHeaderItem } from './types'
import s from './navigation-header.module.css'

const NavigationHeader = () => {
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
  const currentProduct = useCurrentProduct()

  const Header = ({ children }: { children: ReactNode }) => (
    <header className={s.navigationHeader}>
      <nav>{children}</nav>
    </header>
  )

  if (currentPath === '/') {
    return (
      <Header>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src="https://via.placeholder.com/232x32?text=LOGO" />
      </Header>
    )
  } else {
    return <Header>{`WIP: ${currentProduct.name} Header`}</Header>
  }
}

export type { NavigationHeaderItem }
export default NavigationHeader
