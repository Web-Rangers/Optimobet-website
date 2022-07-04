import { useState } from 'react'
import styles from '../styles/components/CasinoCard.module.css'
import { AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Stars from './Stars'
import TermsModal from './TermsModal'
import useWindowSize from '../hooks/useWindowSize'

export default function CasinoCard({
    claim_bonus_url,
    bonus_url,
    features,
    games,
    positives,
    rating,
    support_language,
    website_language,
    url,
    shared_content,
    id,
    terms_and_conditions,
    image_source,
    bg_color
}) {
    const [modal, setModal] = useState(false)
    const { width } = useWindowSize()

    return (
        <div className={styles.casino}>
            <Link href={`/casinos/${id}`}>
                <a className={styles.casinoImage} style={{ backgroundColor: bg_color }}>
                    <Image
                        src={`${process.env.IMAGE_URL}/${image_source}`}
                        layout='fill'
                        objectFit='contain'
                    />
                </a>
            </Link>
            <div className={styles.casinoInfo}>
                <div className={styles.casinoColumn}>
                    <div className={styles.casinoName}>
                        <span className={styles.casinoNameText}>{shared_content.name}</span>
                        <div className={styles.casinoRating}>
                            <Stars points={rating} />
                        </div>
                    </div>
                    <div className={styles.casinoTags}>
                        {
                            features.map(tag => (
                                <div className={styles.casinoTag} key={tag}>
                                    <Image
                                        src="/images/icons/circle-check.svg"
                                        height={24}
                                        width={24}
                                    />
                                    {tag}
                                </div>
                            ))
                        }
                    </div>
                    {width <= 480 &&
                        <div className={styles.casinoLanguages}>
                            <div className={styles.languageContainer}>
                                <span className={styles.languageTitle}>Website</span>
                                <div className={styles.languageContent}>
                                    {
                                        website_language.slice(0, 2).map(lang => (
                                            <div className={styles.language} key={`${id}_website_${lang.id}`} >
                                                <Image
                                                    src={`${process.env.IMAGE_URL}/${lang.flag_source}`}
                                                    alt={lang.name}
                                                    height={20}
                                                    width={27}
                                                    objectFit='contain'
                                                />
                                            </div>
                                        ))
                                    }
                                    {website_language.length > 2 && <div className={`${styles.language} ${styles.grayNums}`}>
                                        +{website_language.length - 2}
                                    </div>}
                                </div>
                            </div>
                            <div className={styles.languageContainer}>
                                <span className={styles.languageTitle}>Live chat</span>
                                <div className={styles.languageContent}>
                                    {
                                        support_language.slice(0, 2).map(lang => (
                                            <div className={styles.language} key={`${id}_support_${lang.id}`} >
                                                <Image
                                                    src={`${process.env.IMAGE_URL}/${lang.flag_source}`}
                                                    alt={lang.name}
                                                    height={20}
                                                    width={27}
                                                    objectFit='contain'
                                                />
                                            </div>
                                        ))
                                    }
                                    {support_language.length > 2 && <div className={`${styles.language} ${styles.grayNums}`}>
                                        +{support_language.length - 2}
                                    </div>}

                                </div>
                            </div>
                        </div>
                    }
                    <span className={styles.subtitle}>
                        Available games
                    </span>
                    <div className={styles.casinoGames}>
                        {
                            games.slice(0, width > 480 ? 5 : 3).map(game => (
                                <div className={styles.casinoGame} key={game.id} >
                                    <Image
                                        src={`${process.env.IMAGE_URL}/${game.image_source}`}
                                        layout='fill'
                                        objectFit='scale-down'
                                        alt={game.name}
                                    />
                                </div>
                            ))
                        }
                        {games.length > width > 480 ? 5 : 3 && <div className={styles.casinoGame} >
                            +{games.length - width > 480 ? 5 : 3}
                        </div>}
                    </div>
                </div>
                <div className={`${styles.casinoColumn} ${styles.right}`}>
                    {width > 480 && <div className={styles.casinoLanguages}>
                        <div className={styles.languageContainer}>
                            <span className={styles.languageTitle}>Website</span>
                            <div className={styles.languageContent}>
                                {
                                    website_language.slice(0, 2).map(lang => (
                                        <div className={styles.language} key={`${id}_website_${lang.id}`} >
                                            <Image
                                                src={`${process.env.IMAGE_URL}/${lang.flag_source}`}
                                                alt={lang.name}
                                                height={20}
                                                width={27}
                                                objectFit='contain'
                                            />
                                        </div>
                                    ))
                                }
                                {website_language.length > 2 && <div className={`${styles.language} ${styles.grayNums}`}>
                                    +{website_language.length - 2}
                                </div>}
                            </div>
                        </div>
                        <div className={styles.languageContainer}>
                            <span className={styles.languageTitle}>Live chat</span>
                            <div className={styles.languageContent}>
                                {
                                    support_language.slice(0, 2).map(lang => (
                                        <div className={styles.language} key={`${id}_support_${lang.id}`} >
                                            <Image
                                                src={`${process.env.IMAGE_URL}/${lang.flag_source}`}
                                                alt={lang.name}
                                                height={20}
                                                width={27}
                                                objectFit='contain'
                                            />
                                        </div>
                                    ))
                                }
                                {support_language.length > 2 && <div className={`${styles.language} ${styles.grayNums}`}>
                                    +{support_language.length - 2}
                                </div>}

                            </div>
                        </div>
                    </div>}
                    <div className={styles.casinoButtons}>
                        <div
                            className={styles.tcButton}
                            onClick={() => {
                                setModal(!modal)
                            }}
                        >
                            {terms_and_conditions &&
                                <AnimatePresence>
                                    {modal &&
                                        <TermsModal
                                            setModalState={setModal}
                                            rules={terms_and_conditions}
                                        />
                                    }
                                </AnimatePresence>
                            }
                            T&C Apply
                        </div>
                        {(claim_bonus_url || bonus_url || url) ?
                            <Link href={claim_bonus_url || bonus_url || url}>
                                <a
                                    target="_blank"
                                    rel='noopener noreferrer'
                                    className={`${styles.casinoButton} ${styles.highlighted}`}
                                >
                                    Get Bonus
                                </a>
                            </Link>
                            :
                            <div className={`${styles.casinoButton} ${styles.highlighted}`}>
                                Get Bonus
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}