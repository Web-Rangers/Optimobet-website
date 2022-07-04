import styles from '../styles/components/TermsModal.module.css'
import { motion } from 'framer-motion'
import Image from 'next/image'
import parse from 'html-react-parser'
import useWindowSize from '../hooks/useWindowSize'
import { useEffect, useRef, useState } from 'react'

export default function TermsModal({ rules, setModalState }) {
    const { width } = useWindowSize()
    const blockRef = useRef()
    const [leftOffset, setLeftOffset] = useState({})

    useEffect(()=>{
        if (width<=750)            
        setLeftOffset({width:width, right:0})
        else
        if (blockRef.current.getBoundingClientRect().left<0) {
            setLeftOffset({width:750+blockRef.current.getBoundingClientRect().left})
        }
    },[width])

    return (
        <motion.div 
            ref={blockRef}
            style={leftOffset}
            className={styles.container}
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.2, ease:"easeInOut"}}
            onClick={(e)=>{
                e.stopPropagation()
            }}
        >
            <div className={styles.termsHeader}>
                <span>
                    TERMS AND CONDITIONS
                </span>
                <div 
                    style={{cursor:"pointer"}}
                    onClick={() => {
                        setModalState && setModalState(false)
                    }}
                >
                    <Image
                        src={"/images/icons/x.svg"}
                        width={18}
                        height={18}
                    />
                </div>
            </div>
            <div className={styles.termsContent}>
                {parse(rules)}
            </div>
            <div className={styles.trigon} />
        </motion.div>
    )
}