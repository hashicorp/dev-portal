import { useRouter } from 'next/router'
import Link from 'next/link'
import Subnav from '@hashicorp/react-subnav'

export default function DocsIndex() {
  const router = useRouter()

  return (
    <>
      <Subnav
        titleLink={{
          text: router.query.product ?? 'hashicorp',
          url: `/docs/${router.query.product}`,
        }}
        currentPath={router.asPath}
        menuItems={[]}
        menuItemsAlign="right"
        constrainWidth
        Link={Link}
        matchOnBasePath
      />
      <div className="g-grid-container">
        <h1>Hello from {router.query.product}</h1>
      </div>
    </>
  )
}
