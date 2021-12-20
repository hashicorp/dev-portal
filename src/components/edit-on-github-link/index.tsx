import InlineSvg from '@hashicorp/react-inline-svg'
import svgGithub from '@hashicorp/flight-icons/svg/github-16.svg?include'
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
      <InlineSvg className={s.editLinkIcon} src={svgGithub} />
      {label}
    </a>
  )
}

export default EditOnGithubLink
