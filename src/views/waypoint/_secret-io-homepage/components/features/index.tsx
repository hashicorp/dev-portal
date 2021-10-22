import MediaObject, {
  MediaObjectProps,
} from 'views/waypoint/_secret-io-homepage/components/media-object'

export type FeaturesProps = Array<MediaObjectProps>

export default function Features({
  items,
}: {
  items: FeaturesProps
}): JSX.Element {
  return (
    <>
      {items.map((item) => (
        <MediaObject
          key={item.heading}
          stacked={item.stacked}
          icon={item.icon}
          heading={item.heading}
          description={item.description}
          link={item.link}
        />
      ))}
    </>
  )
}
