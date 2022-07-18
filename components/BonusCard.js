import { useRef, useState } from 'react'
import styles from '../styles/components/BonusCard.module.css'
import { AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Stars from './Stars'
import TermsModal from './TermsModal'
import useWindowSize from '../hooks/useWindowSize'

export default function BonusCard({ name, title, terms_and_condition, bonusable, games = [], id, bg_color }) {
    const [modal, setModal] = useState(false)
    const { width } = useWindowSize();
    const gameCount = useRef(width <= 480 ? 5 : 3);

    return (
        <div className={styles.casino}>
            <div className={styles.casinoImage} style={{ backgroundColor: bg_color }}>
                <div className={styles.imageContainer}>
                    <Image
                        src={`${process.env.IMAGE_URL}/${bonusable?.image_source}`}
                        layout='fill'
                        objectFit='contain'
                    />
                </div>
            </div>
            <div className={styles.casinoInfo}>
                <div className={styles.casinoColumn}>
                    <div className={styles.casinoName}>
                        <span className={styles.casinoNameText}>
                            {bonusable?.shared_content?.name || ""}
                        </span>
                        {bonusable?.rating &&
                            <div className={styles.casinoRating}>
                                <Stars points={bonusable?.rating} />
                            </div>
                        }
                        <span className={styles.titleText}>
                            {title || name || ""}
                        </span>
                    </div>
                    <div className={styles.casinoTags}>
                        {
                            bonusable?.features?.map(tag => (
                                <div className={styles.casinoTag} key={`${tag}-${id}`}>
                                    <Image
                                        src="/images/icons/circle-check.svg"
                                        height={18}
                                        width={18}
                                    />
                                    {tag}
                                </div>
                            ))
                        }
                    </div>
                    <span className={styles.subtitle}>
                        Available games
                    </span>
                    <div className={styles.casinoGames}>
                        {
                            bonusable?.games?.slice(0, gameCount.current)?.map(game => (
                                <div className={styles.casinoGame} key={`${game.id}-${id}`} title={game.name} >
                                    <Image
                                        src={`${process.env.IMAGE_URL}/${game.image_source}`}
                                        layout='fill'
                                        objectFit='scale-down'
                                        alt={game}
                                    />
                                </div>
                            ))
                        }
                        {bonusable?.games.length > gameCount.current && <div className={styles.casinoGame} >
                            +{bonusable?.games.length - gameCount.current}
                        </div>}
                    </div>
                </div>
                <div className={`${styles.casinoColumn} ${styles.right}`}>
                    <div className={styles.casinoLanguages}>
                        <div className={styles.languageContainer}>
                            <span className={styles.languageTitle}>Website</span>
                            <div className={styles.languageContent}>
                                {
                                    bonusable?.website_language?.slice(0, 2)?.map(lang => (
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
                                {bonusable?.website_language.length > 2 && <div className={`${styles.language} ${styles.grayNums}`}>
                                    +{bonusable?.website_language.length - 2}
                                </div>}
                            </div>
                        </div>
                        <div className={styles.languageContainer}>
                            <span className={styles.languageTitle}>Live chat</span>
                            <div className={styles.languageContent}>
                                {
                                    bonusable?.support_language?.slice(0, 2)?.map(lang => (
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
                                {bonusable?.support_language.length > 2 && <div className={`${styles.language} ${styles.grayNums}`}>
                                    +{bonusable?.support_language.length - 2}
                                </div>}

                            </div>
                        </div>
                    </div>
                    <div className={styles.casinoButtons}>
                        <div
                            className={styles.tcButton}
                            onClick={() => {
                                setModal(!modal)
                            }}
                        >
                            {terms_and_condition &&
                                <AnimatePresence>
                                    {modal &&
                                        <TermsModal
                                            setModalState={setModal}
                                            rules={terms_and_condition}
                                        />
                                    }
                                </AnimatePresence>
                            }
                            T&C Apply
                        </div>
                        {(bonusable?.claim_bonus_url || bonusable?.bonus_url || bonusable?.url) ?
                            <Link href={bonusable?.claim_bonus_url || bonusable?.bonus_url || bonusable?.url}>
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
        </div>
    )
}