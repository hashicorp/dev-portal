// Components
import Heading from "@components/heading";
import Text from "@components/text";
import Link from "@components/link";
import classNames from "classnames";

// Icons
import { IconFileText16 } from "@hashicorp/flight-icons/svg-react/file-text-16";
import { IconGuide16 } from "@hashicorp/flight-icons/svg-react/guide-16";
import { IconTerminalScreen16 } from "@hashicorp/flight-icons/svg-react/terminal-screen-16";
import { IconStarFill16 } from "@hashicorp/flight-icons/svg-react/star-fill-16";
import { IconArrowRight16 } from "@hashicorp/flight-icons/svg-react/arrow-right-16";

// Styles
import s from "./certification-card.module.css";

// Types
import { CertificationCardProps } from "./types";

// Array to store icons for certification details. The order of the icons in this array should match the order of the certification details in the certDetails prop.
const icons = [
    <IconFileText16 key={`icon ${0}`} />,
    <IconGuide16 key={`icon ${1}`} />,
    <IconTerminalScreen16 key={`icon ${2}`} />,
];

// Function to generate star icons for non-reduced certification cards.
function generateStars(starCount: number = 0, product: string) {
    const stars = [];
    for (let i = 0; i < starCount; i++) {
        stars.push(
        <IconStarFill16 key={`star ${i}`} className={classNames(s.star, product)} />
    );
    }
    return stars;
}

function CertificationCard ({ product, title, desc, starCount, cta, ctaLink, certDetails }: CertificationCardProps) {
    return (
        <Link className={s.certificationCard} href={ctaLink}>
            <div className={classNames(s.topBar, product)}/>
            <div className={s.stars}>
                {generateStars(starCount, product)}
            </div>
            <div className={s.certContent}>
                <div className={s.certHeader}>
                    <Heading level={2} size={400} weight={"bold"}>        
                        {title}
                    </Heading>
                    <Text size={200}>
                        {desc}
                    </Text>
                </div>
                <ul className={s.certDetails}>
                    {certDetails && certDetails.map((detail, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li className={s.certDetail} key={index}>
                            {icons[index]}
                            <Text size={200} weight={"regular"}>
                                {detail}
                            </Text>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={s.cta}>
                <Text size={100} weight={"medium"}>{cta}</Text>
                <IconArrowRight16 />
            </div>
        </Link>
    );
}

function CertificationCardReduced ({ product, title, cta, ctaLink }: CertificationCardProps) {
    return (
        <Link className={classNames(s.certificationCard, s.certificationCardReduced)} href={ctaLink}>
            <div className={classNames(s.topBar, product)}/>
            <div className={s.certContent}>
                <div className={s.certHeader}>
                    <Heading level={2} size={300} weight={"bold"}>{title}</Heading>
                </div>
            </div>
            <div className={s.cta}>
                <Text size={100} weight={"medium"}>{cta}</Text>
                <IconArrowRight16 />
            </div>
        </Link>
    );
}

// Exported function to display either a full or reduced certification card based on the isReduced prop.
export function CertificationCardDisplay( { isReduced = false, product, title, desc, starCount, cta = "Learn more", ctaLink, certDetails } : CertificationCardProps) {
    product = product.toLowerCase(); // Ensure product is in lowercase for consistent styling
    return (
        isReduced ?
            <CertificationCardReduced product={product} title={title} cta={cta} ctaLink={ctaLink} />
        :
            <CertificationCard product={product} title={title} desc={desc} starCount={starCount} cta={cta} ctaLink={ctaLink} certDetails={certDetails} />
    )
}