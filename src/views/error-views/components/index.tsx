import { ReactNode } from 'react'
import s from './error-view-components.module.css'

function ErrorViewContainer({ children }: { children: ReactNode }) {
  return <div className={s.container}>{children}</div>
}

function ErrorViewH1({ children }: { children: ReactNode }) {
  return <h1 className={s.heading}>{children}</h1>
}

function ErrorViewParagraph({ children }: { children: ReactNode }) {
  return <p className={s.paragraph}>{children}</p>
}

export { ErrorViewContainer, ErrorViewH1, ErrorViewParagraph }
