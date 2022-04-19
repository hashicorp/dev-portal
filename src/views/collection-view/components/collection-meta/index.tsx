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
      <span className={s.icon}>(Collection icon)</span>
      <Heading
        level={1}
        size={500}
        weight="bold"
        slug={heading.id}
        className={s.heading}
      >
        {heading.text}
      </Heading>
      <Text className={s.description}>{description}</Text>
      <div className={s.cta}>
        {/* TODO this needs to be a link*/}
        <Button color="primary" text="Start" />
        <Text className={s.ctaCollectionInfo}>{`(icon) ${numTutorials} ${
          numTutorials > 1 ? `tutorials` : `tutorial`
        }`}</Text>
      </div>
    </>
  )
}
