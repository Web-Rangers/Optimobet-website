import Image from 'next/image';
import styles from '../../styles/pages/CasinoPage.module.css'

import Stars from '../../components/Stars'

export default function CasinoPage({ casino }) {
    
    return (
        <div className={styles.container}>
            <div className={styles.sideCol}>
                <div className={styles.casinoCard}>
                    <div className={styles.casinoHeaderCard}>
                        <div className={styles.casinoHeaderLogo}>
                            <Image
                                src="/placeholder.png"
                                objectFit='contain'
                                layout='fill'
                            />
                        </div>
                    </div>
                    <div className={styles.casinoContentCard}>
                        <span className={styles.casinoCompany}>
                            JOCSOLUTIONS LIMITED
                        </span>
                        <span className={styles.casinoName}>
                            IVI Casino
                        </span>
                        <div className={styles.stars}>
                            <Stars points={4.1} />
                        </div>
                        <div className={styles.bonuses}>
                            <span>
                                Smaller online casino
                            </span>
                            <span>
                                100% BONUS ON SPORT
                            </span>
                        </div>
                        <div className={styles.buttonBonus}>
                            <button className={styles.getBonus}>
                                Visit website
                            </button>
                            <span className={styles.bonusApply}>
                                T{'&'}C Apply
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.complaint}>
                    Submit a complaint
                </div>
                <div className={styles.advantages}>
                    <span>
                        Casino receives gamblers from numerous countries
                    </span>
                    <span>
                        Support in chat is available 24/7
                    </span>
                </div>
                <div className={styles.disadvantages}>
                    <span>
                        Low monthly withdrawal limit
                    </span>
                    <span>
                        Not all payment methods are available for every currency
                    </span>
                </div>
            </div>
            <div className={styles.mainCol}>

            </div>
        </div>
    )
}

CasinoPage.withHeader = true;

export async function getStaticProps({ params }) {
    const { casino } = params

    return {
        props: {
            casino 
        },
        revalidate: 60,
    }
}

export async function getStaticPaths() {
    const paths = new Array(10).fill(0).map((_, i) => ({ params: { casino: i.toString() } }))

    return { paths, fallback: 'blocking' }
}