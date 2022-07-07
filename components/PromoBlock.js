import styles from '/styles/components/PromoBlock.module.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Image from 'next/image'
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromoBlock({
    bgColor,
    charactersImage,
    charactersWidth,
    charactersHeight,
    name,
    single_bonuses,
    claim_bonus_text,
    bonus_url,
    countries,
    rating,
    image_source,
    shared_content
}) {
    const [buttonBg, setButtonBg] = useState("")

    useEffect(() => {
        switch (bgColor) {
            case "#4B4453":
                setButtonBg("#F2F2F233")
                break;
            default:
                setButtonBg("")
                break;
        }
    }, [bgColor])

    return (
        <div className={styles.promoBlock}>
            <div
                className={styles.promoBackground}
                style={{ background: bgColor || "" }}
            />
            <div className={styles.promoContent}>
                <div className={styles.promoContentInfo}>
                    <div className={styles.promoTitle}>
                        <div className={styles.promoReputation}>
                            <CircularProgressbar
                                value={rating}
                                text={`${rating}%`}
                                styles={{
                                    root: {},
                                    path: {
                                        stroke: `#FFFFFF`,
                                        strokeWidth: "4px"
                                    },
                                    trail: {
                                        stroke: '#EFEFEF44'
                                    },
                                    text: {
                                        fill: '#FFFFFF',
                                        fontWeight: 700
                                    }
                                }}
                            />
                        </div>
                        <div className={styles.promoSiteInfo}>
                            <span className={styles.promoCountry}>
                                {countries[0]?.name}
                            </span>
                            <div className={styles.headerImage}>
                                <Image
                                    src={`${process.env.IMAGE_URL}${image_source}`}
                                    objectFit='contain'
                                    layout='fill'
                                    objectPosition={'left center'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.promoBonusInfo}>
                        <span className={styles.promoBonus}>
                            {single_bonuses?.name || shared_content.name}
                        </span>
                        {
                            single_bonuses?.features?.map(feature => (
                                <span key={feature} className={styles.promoCheckInfo}>
                                    {feature}
                                </span>
                            ))
                        }
                    </div>
                </div>
                <div className={styles.promoBonusButton}>
                    <a
                        href={bonus_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.promoGetBonus}
                        style={buttonBg ? { backgroundColor: buttonBg } : {}}
                    >
                        Get Bonus
                    </a>
                    <Link href={"/bookmakers"}>
                        <a className={styles.promoBonusApply}>
                            View more
                        </a>
                    </Link>
                </div>
            </div>
            <div
                className={styles.characters}
                style={{ width: charactersWidth || "", height: charactersHeight || "" }}
            >
                {charactersImage && <Image
                    src={charactersImage}
                    objectFit='contain'
                    layout='fill'
                    objectPosition='right bottom'
                />}
            </div>
        </div>
    )
}