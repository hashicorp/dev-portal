import React, { ReactNode } from 'react'
import classNames from 'classnames'
import s from './style.module.css'

interface SectionProps {
  className?: string
  id?: string
  children: React.ReactNode
}

function Section({ className, id, children }: SectionProps) {
  return (
    <section className={classNames(s.section, className)} id={id}>
      {children}
    </section>
  )
}
function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className={s.sectionHeading}>{children}</h2>
}

function SectionDescription({ children }: { children: ReactNode }) {
  return <p className={s.sectionDescription}>{children}</p>
}

export default Section
export { SectionHeading, SectionDescription }
