import React, { useEffect, useState } from 'react'
import styles from '../../styles/components/CheckboxFilter.module.css'
import { motion } from 'framer-motion'

export default function CheckboxFilter({ items, title, collapsible = false, initialOpen = true, onChange }) {
    const [active, setActive] = useState()
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
            height: 0,
        }
    }

    const chevronVariants = {
        open: {
            rotate: 90,
        },
        closed: {
            rotate: -90,
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
                    >
                        {'>'}
                    </motion.span>
                }
            </div>}
            <motion.div
                variants={itemsVariants}
                animate={isOpen ? 'open' : 'closed'}
                className={styles.items}
            >
                {items.map(item => (
                    <div
                        key={`type_${item.id}`}
                        className={`${styles.type} ${active === item.id && styles.active}`}
                        onClick={() => item.id !== active && handleChange(item)}
                    >
                        <div className={styles.typeName}>{item.name}</div>
                        <div className={styles.typeCheckbox} />
                    </div>
                ))}
            </motion.div>
        </motion.div>
    )
}