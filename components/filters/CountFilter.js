import React, { useState } from 'react'
import styles from '../../styles/components/CountFilter.module.css'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function CountFilter({ items, title, collapsible = false, initialOpen = true, onChange, initialActive }) {
    const [active, setActive] = useState(initialActive)
    const [isOpen, setIsOpen] = useState(initialOpen)

    const contentVariants = {
        open: {
            gap: '20px',
        },
        closed: {
            gap: 0,
        }
    }

    const itemsVariants = {
        open: {
            height: 'fit-content'
        },
        closed: {
            height: 0
        }
    }

    const itemVariants2 = {
        open: {
            maxHeight: 500,
            overflowY: 'scroll'
        },
        closed: {
            maxHeight: 330,
            overflowY: 'hidden'
        }
    }

    const chevronVariants = {
        open: {
            rotate: 90,
        },
        closed: {
            rotate: 0,
        }
    }

    function handleChange(item) {
        setActive(item.id)
        onChange && onChange(item)
    }

    return (
        <motion.div
            variants={contentVariants}
            animate={isOpen ? 'open' : 'closed'}
            className={styles.filter}
            transition={{duration:0.2, ease:"easeInOut"}}
        >
            {title && <div
                onClick={() => collapsible && setIsOpen(!isOpen)}
                className={styles.title}
            >
                {title}
                {collapsible &&
                    <motion.span
                        variants={chevronVariants}
                        animate={isOpen ? 'open' : 'closed'}
                        transition={{duration:0.2, ease:"easeInOut"}}
                    >
                        <Image
                            src="/images/icons/chevron-down.svg"
                            width={24}
                            height={24}
                        />
                    </motion.span>
                }
            </div>}
            <motion.div
                variants={title ? itemsVariants : itemVariants2}
                animate={isOpen ? 'open' : 'closed'}
                className={styles.items}
                transition={{duration:0.2, ease:"easeInOut"}}
            >
                {items.map(item => (
                    <div
                        key={`provider_${item.id}`}
                        className={`${styles.provider} ${active === item.id && styles.active}`}
                        onClick={() => item.id !== active && handleChange(item)}
                    >
                        <div className={styles.providerName}>{item.name}</div>
                        <div className={styles.providerCount}>{item.count}</div>
                    </div>
                ))}
            </motion.div>
            <div className={styles.more} onClick={() => setIsOpen(!isOpen)}>
                Show {!isOpen ? 'More' : 'Less'}
            </div>
        </motion.div>
    )
}