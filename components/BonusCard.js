import { useState } from 'react'
import styles from '../styles/components/BonusCard.module.css'
import { AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Stars from './Stars'

export default function BonusCard({ name, title, bonusable, games = [] }) {
    const [modal, setModal] = useState(false)

    return (
        <div className={styles.casino}>
            <div className={styles.casinoImage}>
                <Image
                    src="/images/casino.png"
                    layout='fill'
                    objectFit='cover'
                />
            </div>
            <div className={styles.casinoInfo}>
                <div className={styles.casinoColumn}>
                    <div className={styles.casinoName}>
                        <span className={styles.casinoNameText}>
                            {bonusable?.shared_content?.name || ""}
                        </span>
                        {bonusable?.rating && 
                            <div className={styles.casinoRating}>
                                <Stars points={bonusable.rating} />
                            </div>
                        }
                        <span className={styles.titleText}>
                            {title || name || ""}
                        </span>
                    </div>
                    <div className={styles.casinoTags}>
                        {
                            bonusable?.features?.map(tag => (
                                <div className={styles.casinoTag} key={tag}>
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
                            games.map(game => (
                                <div className={styles.casinoGame} key={game} >
                                    <Image
                                        src="/images/game.png"
                                        layout='fill'
                                        objectFit='cover'
                                        alt={game}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={`${styles.casinoColumn} ${styles.right}`}>
                    <div className={styles.casinoLanguages}>
                        <div className={styles.languageContainer}>
                            <span className={styles.languageTitle}>Website</span>
                            <div className={styles.languageContent}>
                                {
                                    [1, 2, 3].map(item => (
                                        <div className={styles.language} key={item}>
                                            <Image
                                                src="/images/icons/flag-en.svg"
                                                height={20}
                                                width={27}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={styles.languageContainer}>
                            <span className={styles.languageTitle}>Live chat</span>
                            <div className={styles.languageContent}>
                                {
                                    [1, 2, 3].map(item => (
                                        <div className={styles.language} key={item}>
                                            <Image
                                                src="/images/icons/flag-en.svg"
                                                height={20}
                                                width={27}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.casinoButtons}>
                        <div 
                            className={styles.tcButton}
                            style={{position:"relative"}}
                            onClick={() => {
                                setModal(!modal)
                            }}
                        >
                            <AnimatePresence>
                                {modal && 
                                    <TermsModal
                                        rules={"sdadasasddasddasdsadsasdasdasad"} 
                                    />
                                }                                
                            </AnimatePresence>
                            T&C Apply
                        </div>
                        {(bonusable?.url || bonusable?.bonus_url || bonusable?.claim_bonus_url) ? 
                            <Link href={bonusable?.url || bonusable?.bonus_url || bonusable?.claim_bonus_url}>
                                <a target="_blank">
                                    <div className={`${styles.casinoButton} ${styles.highlighted}`}>
                                        Get Bonus
                                    </div>
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