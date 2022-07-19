import Image from 'next/image'
import styles from '../styles/components/Slot.module.css'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import useWindowSize from '../hooks/useWindowSize'

export default function Slot({ name, provider, score, big, id, style, image_source }) {
    const [hover, setHover] = useState(false)
    const { width } = useWindowSize()

    const variants = {
        "top": {
            bottom: "98px"
        },
        "bot": {
            bottom: "30px"
        }
    }

    return (
        <Link href={`/slots/${id}`}>
            <motion.div
                layout
                layoutId={`slot_${name}_${id}`}
                className={`${styles.slot} ${big && styles.big}`}
                style={style}
                onHoverStart={() => {
                    setHover(true)
                }}
                onHoverEnd={() => {
                    setHover(false)
                }}
            >
                <div className={styles.provider}>
                    <Image
                        src={`${process.env.IMAGE_URL}/${provider?.image_source}`}
                        layout="fill"
                        objectFit='contain'
                        objectPosition={width > 480 ? 'left center' : 'center'}
                    />
                </div>
                <div className={styles.pictureArea}>
                    <Image
                        src={`${process.env.IMAGE_URL}/${image_source}`}
                        alt={name}
                        layout={'fill'}
                        objectFit={'cover'}
                    />
                </div>
                <motion.div
                    className={styles.slotInfo}
                    animate={hover ? "top" : "bot"}
                    variants={variants}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <span className={styles.slotName}>{name}</span>
                    <span className={styles.slotProvider}>{provider?.name}</span>
                </motion.div>
                <AnimatePresence>
                    {hover && !big &&
                        <Link href={`/slots/${id}`}>
                            <motion.div
                                className={styles.slotButtonCenter}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                Play Now
                            </motion.div>
                        </Link>
                    }
                </AnimatePresence>
                {score && <div className={styles.slotRating}>
                    {score}
                </div>}
                {
                    big &&
                    <Link href={`/slots/${id}`}>
                        <div className={styles.slotButton}>
                            Play Now
                        </div>
                    </Link>
                }
            </motion.div>
        </Link>
    )
}