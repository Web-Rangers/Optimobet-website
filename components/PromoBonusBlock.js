import styles from '/styles/components/PromoBlock.module.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Image from 'next/image'
import { useState, useEffect } from 'react';

export default function PromoBonusBlock({
    bgColor,
    charactersImage,
    charactersWidth,
    claim_bonus_text,
    title,
    claim_bonus_url,
    country,
    bonusable,
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
                                value={bonusable.reputation}
                                text={`${bonusable.reputation}%`}
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
                                {country?.name}
                            </span>
                            <Image
                                src={`${process.env.IMAGE_URL}/${bonusable.image_source}`}
                                objectFit='cover'
                                width={80}
                                height={32}
                            />
                        </div>
                    </div>
                    <div className={styles.promoBonusInfo}>
                        <span className={styles.promoBonus}>
                            {title || claim_bonus_text}
                        </span>
                        {
                            bonusable.features?.map(feature => (
                                <span key={feature} className={styles.promoCheckInfo}>
                                    {feature}
                                </span>
                            ))
                        }
                    </div>
                </div>
                <div className={styles.promoBonusButton}>
                    <a
                        href={claim_bonus_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.promoGetBonus}
                        style={{ backgroundColor: buttonBg }}
                    >
                        Get Bonus
                    </a>
                    <a className={styles.promoBonusApply}>
                        View more
                    </a>
                </div>
            </div>
            <div
                className={styles.characters}
                style={{ width: charactersWidth || "" }}
            >
                {charactersImage && <Image
                    src={charactersImage}
                    objectFit='contain'
                    layout='fill'
                />}
            </div>
        </div>
    )
}