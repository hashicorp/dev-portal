import { IconChevronRight24 } from '@hashicorp/flight-icons/svg-react/chevron-right-24'
import Disclosure from 'components/disclosure'
import Text from 'components/text'
import { AccordionDisclosureProps } from './types'
import s from './accordion-disclosure.module.css'

const AccordionDisclosure = ({
  children,
  description,
  open,
  title,
}: AccordionDisclosureProps) => {
  return (
    <Disclosure
      activatorClassName={s.button}
      activatorContent={
        <>
          <span className={s.labelContainer}>
            <Text asElement="span" className={s.title} weight="semibold">
              {title}
            </Text>
            {description && (
              <Text asElement="span" className={s.description} size={200}>
                {title}
              </Text>
            )}
          </span>
          <IconChevronRight24 />
        </>
      }
      containerClassName={s.root}
      containerExpandedClassName={s['root-expanded']}
      contentContainerClassName={s.content}
      open={open}
    >
      {children}
    </Disclosure>
  )
}

export type { AccordionDisclosureProps }
export default AccordionDisclosure
