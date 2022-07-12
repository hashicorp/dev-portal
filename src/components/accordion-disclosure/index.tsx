import classNames from 'classnames'
import { IconChevronRight24 } from '@hashicorp/flight-icons/svg-react/chevron-right-24'
import Disclosure, {
  DisclosureActivator,
  DisclosureContent,
} from 'components/disclosure'
import Text from 'components/text'
import { AccordionDisclosureProps } from './types'
import s from './accordion-disclosure.module.css'

const AccordionDisclosure = ({
  children,
  description,
  initialOpen,
  title,
}: AccordionDisclosureProps) => {
  const generateContainerClassName = (isOpen: boolean) => {
    return classNames(s.root, {
      [s['root-expanded']]: isOpen,
    })
  }

  return (
    <Disclosure
      containerClassName={generateContainerClassName}
      initialOpen={initialOpen}
    >
      <DisclosureActivator className={s.button}>
        <span className={s.labelContainer}>
          <Text asElement="span" className={s.title} weight="semibold">
            {title}
          </Text>
          {description && (
            <Text asElement="span" className={s.description} size={200}>
              {description}
            </Text>
          )}
        </span>
        <IconChevronRight24 />
      </DisclosureActivator>
      <DisclosureContent className={s.content}>{children}</DisclosureContent>
    </Disclosure>
  )
}

export type { AccordionDisclosureProps }
export default AccordionDisclosure
