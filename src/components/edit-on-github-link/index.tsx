import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
import classNames from 'classnames'
import s from './edit-on-github-link.module.css'

function EditOnGithubLink({
  url,
  label = 'Edit this page',
  className,
}: {
  /** The URL to link to */
  url: string
  /** Optional text to override the default label */
  label?: string
  /** Optional className, for adding margin around the component.  */
  className?: string
}): React.ReactElement {
  return (
    <a
      href={url}
      target="_blank"
      className={classNames(s.editLink, className)}
      rel="noreferrer"
    >
      <IconGithub16 className={s.editLinkIcon} />
      {label}
    </a>
  )
}

export default EditOnGithubLink
