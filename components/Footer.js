import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/components/Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.container}>
            <div className={styles.cols}>
                <div className={styles.column}>
                    <span className={styles.colTitle}>
                        Popular links
                    </span>
                    <Link href={'/casinos'}>
                        <a>
                            Online Casions
                        </a>
                    </Link>
                    <Link href={'/bonuses'}>
                        <a>
                            Bonuses
                        </a>
                    </Link>
                    <Link href={'/bookmakers'}>
                        <a>
                            Bookmakers
                        </a>
                    </Link>
                    <Link href={'/slots'}>
                        <a>
                            Free Slots
                        </a>
                    </Link>
                </div>
                <div className={styles.column}>
                    <span className={styles.colTitle}>
                    </span>
                    <Link href={'/casinos'}>
                        <a>
                            Online Casions
                        </a>
                    </Link>
                    <Link href={'/bonuses'}>
                        <a>
                            Bonuses
                        </a>
                    </Link>
                    <Link href={'/bookmakers'}>
                        <a>
                            Bookmakers
                        </a>
                    </Link>
                    <Link href={'/slots'}>
                        <a>
                            Free Slots
                        </a>
                    </Link>
                </div>
                <div className={styles.column}>
                    <span className={`${styles.colTitle} ${styles.hideMobile}`}>

                    </span>
                    <Link href={'/casinos'}>
                        <a>
                            Online Casions
                        </a>
                    </Link>
                    <Link href={'/bonuses'}>
                        <a>
                            Bonuses
                        </a>
                    </Link>
                    <Link href={'/bookmakers'}>
                        <a>
                            Bookmakers
                        </a>
                    </Link>
                    <Link href={'/slots'}>
                        <a>
                            Free Slots
                        </a>
                    </Link>
                </div>
                <div className={styles.column}>
                    <span className={`${styles.colTitle} ${styles.hideMobile}`}>

                    </span>
                    <Link href={'/casinos'}>
                        <a>
                            Online Casions
                        </a>
                    </Link>
                    <Link href={'/bonuses'}>
                        <a>
                            Bonuses
                        </a>
                    </Link>
                    <Link href={'/bookmakers'}>
                        <a>
                            Bookmakers
                        </a>
                    </Link>
                    <Link href={'/slots'}>
                        <a>
                            Free Slots
                        </a>
                    </Link>
                </div>
            </div>
            <div className={`${styles.cols} ${styles.bottomCols}`}>
                <div className={styles.column}>
                    <span className={styles.colTitle}>
                        Play
                    </span>
                    <Link href={'/casinos'}>
                        <a>
                            Online Casions
                        </a>
                    </Link>
                    <Link href={'/bonuses'}>
                        <a>
                            Bonuses
                        </a>
                    </Link>
                    <Link href={'/bookmakers'}>
                        <a>
                            Bookmakers
                        </a>
                    </Link>
                    <Link href={'/slots'}>
                        <a>
                            Free Slots
                        </a>
                    </Link>
                </div>
                <div className={styles.column}>
                    <span className={styles.colTitle}>
                        Our company
                    </span>
                    <Link href={'#'}>
                        <a>
                            Who we are
                        </a>
                    </Link>
                    <Link href={'#'}>
                        <a>
                            Contact support
                        </a>
                    </Link>
                    <Link href={'#'}>
                        <a>
                            Subscribe
                        </a>
                    </Link>
                </div>
                <div className={styles.column}>
                    <span className={styles.colTitle}>
                        READ BEFORE PLAY
                    </span>
                    <Link href={'#'}>
                        <a>
                            Terms and conditions
                        </a>
                    </Link>
                    <Link href={'#'}>
                        <a>
                            Privacy policy
                        </a>
                    </Link>
                </div>
            </div>
            <span className={styles.footerText}>
                Optimobet.com has no intention to use any kind of information which it provides for illegal purposes. Carrying on using this site you agree to our terms and policy of confidentiality.<br /> Optimobet.com respects confidentiality of all sides, viewing and using the site in different ways, and undertakes to secure their privacy. The site is able to collect and use “Personal data”, related to its Visitors, to provide them the services of the site. Before registration with the betting operator you take your own responsibility to comply with all aged-related and other relevant requirements. Online bets are illegal in some jurisdictions. Before gambling you are obliged to view the local rules. Optimobet.com bears no responsibility for your actions.<br /> Optimobet.com acts independently and is not controlled by the bookmaker offices or gambling operators. Optimobet.com is intended for only people above 18. Playing with any operator, remember, that gambling causes the addiction, and always play responsibly. We support the responsible game, that’s why if you need any information about gambling addiction or need any support, use begambleaware.org
            </span>
            <span className={styles.footerText}>
                PLEASE, PLAY RESPONSIBLY.
            </span>
            <div className={styles.footBottom}>
                <div className={styles.footerImgContent}>
                    <Image
                        src="/images/footer/gambleaware.svg"
                        height={40}
                        width={300}
                    />
                    <Image
                        src="/images/footer/18.svg"
                        height={40}
                        width={40}
                    />
                    <Image
                        src="/images/footer/gamcare.svg"
                        height={40}
                        width={40}
                    />
                </div>
                <div className={styles.copyWithSocial}>
                    <div className={styles.copyright}>
                        Optimobet.com © 2022 QUALERIO HOLDINGS LTD. All rights reserved
                    </div>
                    <div className={styles.socials}>
                        <Link href={"#"}>
                            <a>
                                <Image
                                    src="/images/icons/socials/facebook.svg"
                                    width={24}
                                    height={24}
                                />
                            </a>
                        </Link>
                        <Link href={"#"}>
                            <a>
                                <Image
                                    src="/images/icons/socials/Twitter.svg"
                                    width={24}
                                    height={24}
                                />
                            </a>
                        </Link>
                        <Link href={"#"}>
                            <a>
                                <Image
                                    src="/images/icons/socials/instagram.svg"
                                    width={24}
                                    height={24}
                                />
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.footerImg}>
                <Image
                    src="/images/footer/brothers.png"
                    layout='fill'
                    objectFit='contain'
                    objectPosition="right bottom"
                />
            </div>
        </footer>
    )
}