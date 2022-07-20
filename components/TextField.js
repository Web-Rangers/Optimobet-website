import styles from '../styles/components/TextField.module.css'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function TextField({ placeholder, ...props }) {
    const [focused, setFocused] = useState(false)

    const focusIfEmpty = (e) => {
        if ((e.target.value.length==0)&&(e.target.type!="date"))
        setFocused(false)
    }

    const placeholderVariants = {
        placeholder:{
            top: 16,
            font: "normal normal normal 15px/16px Samsung Sans"
        },
        label:{
            top: 8,
            font: "normal normal normal 12px/16px Samsung Sans"
        }
    }

    return (
        <div className={styles.wrap}>
            {placeholder &&
                <motion.label
                    className={styles.placeholder}
                    transition={{duration:0.12, ease:'easeInOut'}}
                    variants={placeholderVariants}
                    animate={focused ? "label" : "placeholder"}
                >
                    {placeholder}
                </motion.label>
            }
            <input
                className={styles.input}
                {...props}
                onFocus={()=>setFocused(true)}
                onBlur={focusIfEmpty}
            />
        </div>
    )
}