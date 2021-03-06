import styles from '/styles/components/NewCasino.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function NewCasino({ 
    type="multi",
    bonus_url, 
    shared_content, 
    features, 
    id, 
    claim_bonus_text, 
    image_source, 
    image_characters, 
    bonus_link, 
    details_link, 
    title 
}) {
    return (
        <a
            href={(type == "single") ? (bonus_url || bonus_link) : null}
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className={styles.casino}>
                <div className={styles.casinoBg}>
                    <Image
                        //src={`${process.env.IMAGE_URL}/${image_source}`}
                        src={image_source}
                        layout='fill'
                        objectFit='cover'
                    />
                </div>
                {type != "single" ? 
                    <div className={styles.characters}>
                        <Image
                            //src={`${process.env.IMAGE_URL}/${image_characters}`}
                            src={image_characters}
                            layout='fill'
                            objectFit='contain'
                            objectPosition='right bottom'
                        />
                    </div>
                    :
                    <div className={styles.charactersCenter}>
                        <Image
                            //src={`${process.env.IMAGE_URL}/${image_characters}`}
                            src={image_characters}
                            layout='fill'
                            objectFit='contain'
                            objectPosition='center bottom'
                        />
                    </div>
                }
                {type != "single" && 
                    <div className={styles.casinoInfo}>
                        <div className={styles.bonusInfo}>
                            <span className={styles.bonusText}>
                                {title || shared_content?.name}
                            </span>
                            {features?.map(feature => {
                                if (feature && feature.length>0)
                                return <span
                                    key={feature}
                                    className={styles.feature}
                                >
                                    {feature}
                                </span>
                            })}
                        </div>
                        <div className={styles.casinoButtons}>
                            <a
                                href={bonus_url || bonus_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.bonusButton}
                            >
                                Get Bonus
                            </a>
                            {bonus_url
                                ? <Link href={`/casinos/${shared_content.slug}`}>
                                    <a className={styles.detailsButton}>
                                        Details
                                    </a>
                                </Link>
                                : <a
                                    className={styles.detailsButton}
                                    href={details_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Details
                                </a>
                            }
                        </div>
                    </div>
                }            
            </div>
        </a>
    );
}