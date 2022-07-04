import React from 'react'
import styles from '/styles/pages/Contact.module.css'

export default function Contact() {
    return (
        <div className={styles.container}>
            <div>
                <h1 className={styles.heading}>Contact us</h1>
                <span className={styles.text}>
                    If you have any questions for us, feel free to get in touch with us by sending an e-mail to:
                </span>
            </div>
            <div className={styles.infoBlock}>
                <div className={styles.info}>
                    <h2>
                        General support
                    </h2>
                    <span className={styles.text}>
                        Info@optimobet.com
                    </span>
                </div>
                <div className={styles.info}>
                    <h2>
                        Press contact
                    </h2>
                    <span className={styles.text}>
                        Press@optimobet.com
                    </span>
                </div>
                <div className={styles.info}>
                    <h2>
                        Contact for casinos
                    </h2>
                    <span className={styles.text}>
                        Affiliate@optimobet.com
                    </span>
                </div>
            </div>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.4596834352806!2d44.78255841535645!3d41.73217678251243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x404472c137a7d0ff%3A0x77b4c196d833f00b!2s60%20Akaki%20Tsereteli%20Ave%2C%20T&#39;bilisi!5e0!3m2!1sru!2sge!4v1656924056061!5m2!1sru!2sge"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            <div className={styles.infoColumns}>
                <div className={styles.infoColumn}>
                    <h3>Phone</h3>
                    <span>
                        +995 598 23 08 23
                    </span>
                    <span>
                        +995 598 12 08 12
                    </span>
                </div>
                <div className={styles.infoColumn}>
                    <h3>Address</h3>
                    <span>
                        Tbilisi, A. Tsereteli Ave 60
                    </span>
                </div>
                <div className={styles.infoColumn}>
                    <h3>Working Hours</h3>
                    <span>
                        10:00 - 24:00
                    </span>
                </div>
                <div className={styles.infoColumn}>
                    <h3>Join with us</h3>
                    <span>
                        Facebook
                    </span>
                    <span>
                        Youtube
                    </span>
                    <span>
                        Twitter
                    </span>
                    <span>
                        Instagram
                    </span>
                </div>
            </div>
        </div>
    )
}


Contact.withHeader = true;
Contact.withFooter = true;