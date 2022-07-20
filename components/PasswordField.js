import { useState } from 'react'
import styles from '../styles/components/PasswordField.module.css'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function PasswordField({placeholder, ...props}) {
    const [typeF, setTypeF] = useState(true)
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
        <div className={styles.container}>
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
                type={typeF ? "password" : "text"} 
                onFocus={()=>setFocused(true)}
                onBlur={focusIfEmpty}
            />
            <div 
                className={styles.eye}
                onClick={()=>{
                    setTypeF(!typeF)
                }}
            >
                <Image
                    src={typeF ? "/images/icons/eye-off.svg" : "/images/icons/eye.svg"}
                    width={24}
                    height={24}
                />
            </div>            
        </div>
    )
}