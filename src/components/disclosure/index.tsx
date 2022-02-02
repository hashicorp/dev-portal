import { FC, useState } from 'react'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'

interface DisclosureProps {
  title: string
  description?: string
  open?: boolean
}

const Disclosure: FC<DisclosureProps> = ({
  title,
  description,
  children,
  open,
}) => {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        <span>
          <span>{title}</span>
          {description && <span>{description}</span>}
        </span>
        <IconChevronRight16 />
      </button>
      <div style={{ display: isOpen ? 'block' : 'none' }}>{children}</div>
    </>
  )
}

export default Disclosure
