// Components
import Heading from '@components/heading'
import Link from '@components/link'
import Text from '@components/text'

// Styles
import s from './announcement.module.css'

// Icon
import { IconGuideLink16 } from '@hashicorp/flight-icons/svg-react/guide-link-16'

export const Announcement = ({ heading, text, cta, ctaLink}: { heading: string, text: string, cta: string, ctaLink: string }) => {
    return (
        <div className={s.announcement}>
            <div className={s.leftSide}>
                <Heading level={2} size={200} weight="medium">
                    {heading}
                </Heading>
            </div>
            <div className={s.rightSide}>
                <Text className={s.text}>{text}</Text>
                <Link className={s.cta} href={ctaLink}>
                    {cta}
                    <IconGuideLink16 />
                </Link>
            </div>
        </div>
    )
}