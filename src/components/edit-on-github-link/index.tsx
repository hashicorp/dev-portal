import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
import s from './style.module.css'

function EditOnGithubLink({
  url,
  label = 'Edit this page',
}: {
  /** The URL to link to */
  url: string
  /** Optional text to override the default label */
  label?: string
}): React.ReactElement {
  return (
    <a href={url} target="_blank" className={s.editLink} rel="noreferrer">
      <IconGithub16 className={s.editLinkIcon} />
      {label}
    </a>
  )
}

export default EditOnGithubLink
