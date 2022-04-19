import Heading from 'components/heading'
import Button from 'components/button'
import Text from 'components/text'
import s from './collection-meta.module.css'

interface CollectionMetaProps {
  heading: {
    text: string
    id: string
  }
  description: string
  numTutorials: number
}

export default function CollectionMeta({
  heading,
  description,
  numTutorials,
}: CollectionMetaProps) {
  return (
    <>
      <p>Collection icon here</p>
      <Heading level={1} size={500} weight="bold" slug={heading.id}>
        {heading.text}
      </Heading>
      <Text className={s.description}>{description}</Text>
      <Button color="primary" text="Start" />
      <p>{`(icon) ${numTutorials} tutorials`}</p>
    </>
  )
}
