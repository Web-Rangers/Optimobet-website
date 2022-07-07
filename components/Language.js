import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/components/Language.module.css'
import Dropdown from './Dropdown'
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import APIRequest from '../functions/requests/APIRequest'
import useUserInfo from '../hooks/useUserInfo'
import { useRouter } from 'next/router'
import useWindowSize from '../hooks/useWindowSize'

const languages = [
    {
        id: 1,
        value: "English",
        code: "EN",
        icon: "/storage/upload/flags/flag-icons-main/flags/4x3/gb.svg"
    },
    {
        id: 2,
        value: "Russian",
        code: "RU",
        icon: "/storage/upload/flags/flag-icons-main/flags/4x3/ru.svg"
    },
    {
        id: 3,
        value: "Spanish",
        code: "ES",
        icon: "/storage/upload/flags/flag-icons-main/flags/4x3/es.svg"
    }
]

export default function Language({ setBorder }) {
    const { width } = useWindowSize()
    const [open, setOpen] = useState(false)
    const [countries, setCountries] = useState()
    const user = useUserInfo();
    const country_id = useRef('GE')
    const language_id = useRef('EN')
    const [countrySelected, setCountrySelected] = useState('GE')
    const [languageSelected, setLanguageSelected] = useState('EN')
    const router = useRouter();
    const blockRef = useRef()
    const [page, setPage] = useState(1)

    const apply = () => {
        const newUser = { ...user };
        newUser.country_code = country_id.current;
        newUser.language_code = language_id.current;
        localStorage.setItem('user', JSON.stringify(newUser));
        router.reload();
        setOpen(false)
    }

    const reset = () => {
        const newUser = { ...user };
        newUser.country_code = undefined;
        newUser.language_code = undefined;
        localStorage.setItem('user', JSON.stringify(newUser));
        router.reload();
        setOpen(false)
    }

    useEffect(() => {
        if (setBorder) {
            setBorder(open)
        }
        country_id.current = JSON.parse(localStorage.getItem('user'))?.country_code || 'GE'
        language_id.current = JSON.parse(localStorage.getItem('user'))?.language_code || 'EN'
        setCountrySelected(JSON.parse(localStorage.getItem('user'))?.country_code || 'GE')
        setLanguageSelected(JSON.parse(localStorage.getItem('user'))?.language_code || 'EN')
    }, [open])

    useEffect(() => {
        APIRequest('/countries', 'GET')
            .then(res => { setCountries(res) })
            .catch(err => console.log(err))
            
        if (window)
            window.addEventListener('click', closeIfNotDropdown)
        return () => {
            window.removeEventListener('click', closeIfNotDropdown)
        }
    }, [])

    const closeIfNotDropdown = (e) => {
        if ((e.target != blockRef.current) && (!blockRef.current.contains(e.target)))
            setOpen(false)
    }

    return (
        <div className={styles.container} ref={blockRef}>
            <div
                className={styles.language}
                onClick={() => setOpen(!open)}
                style={open ? { borderColor: "#7F3FFC" } : {}}
            >
                <span>{language_id.current || " "}</span>
                <span className={styles.separator} />
                <div className={styles.userCountry}>
                    <Image
                        src={`${process.env.IMAGE_URL}/${countries?.find(country => country.code === user?.country_code)?.flag_source}`}
                        width={27}
                        height={20}
                        objectFit="contain"
                        alt={countries?.find(country => country.code === user?.country_code)?.name}
                    />
                </div>
            </div>
            <AnimatePresence>
                {open &&
                    <>
                        {width > 480 ?
                            <motion.div
                                className={styles.languageSelector}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                <span className={styles.languageHeader}>
                                    Choose Language
                                </span>
                                <Dropdown
                                    description={"Website Language"}
                                    onChange={(item) => language_id.current = languages.find(lang => lang.id === item.id)?.code}
                                    items={languages}
                                />
                                <Dropdown
                                    defaultSelected={countries?.find(country => country.code === user?.country_code)?.id}
                                    onChange={(item) => country_id.current = countries.find(country => country.id === item.id)?.code}
                                    items={countries?.map(country => ({ id: country.id, value: country.name, icon: country.flag_source }))}
                                    description={"Your Country"}
                                    searchable
                                />
                                <div className={styles.applyOrReset}>
                                    <div
                                        className={styles.buttonApply}
                                        onClick={apply}
                                    >
                                        Apply Settings
                                    </div>
                                    <div
                                        className={styles.buttonReset}
                                        onClick={reset}
                                    >
                                        Reset
                                    </div>
                                </div>
                            </motion.div>
                            :
                            <motion.div
                                className={styles.langMobile}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <AnimateSharedLayout transition={{duration: 0.2}}>
                                    <div className={styles.tabs}>
                                        <motion.div 
                                            className={`${styles.tab} ${page==1 && styles.activeTab}`}
                                            onClick={()=>setPage(1)}
                                            animate
                                        >
                                            Website Language
                                            {page == 1 &&                                    
                                                <motion.div 
                                                    className={styles.activeLine}
                                                    layoutId="underline"
                                                    animate
                                                />
                                            } 
                                        </motion.div>
                                        <motion.div 
                                            className={`${styles.tab} ${page==2 && styles.activeTab}`}
                                            onClick={()=>setPage(2)}
                                            animate
                                        >
                                            Your Country
                                            {page == 2 &&                                    
                                                <motion.div 
                                                    className={styles.activeLine}
                                                    layoutId="underline"
                                                    animate
                                                />
                                            } 
                                        </motion.div>
                                    </div>
                                </AnimateSharedLayout>
                                <AnimatePresence initial={false}>
                                    {page == 1 && 
                                        <>
                                            <motion.div
                                                initial={{opacity:0}}
                                                animate={{opacity:1}}
                                                exit={{opacity:0}}
                                                transition={{duration:0.2, ease:"easeInOut"}}
                                                className={styles.bubblesWrap}
                                            >
                                                <div className={styles.bubblesBlock}>
                                                    {languages.map(lang => (
                                                        <div 
                                                            className={`${styles.langBubble} ${lang.code==languageSelected && styles.activeBubble}`}
                                                            key={`lang-${lang.id}`}
                                                            onClick={()=>{
                                                                language_id.current = lang.code
                                                                setLanguageSelected(lang.code)
                                                            }}
                                                        >
                                                            <Image
                                                                src={`${process.env.IMAGE_URL}/${lang.icon}`}
                                                                width={27}
                                                                height={20}
                                                                objectFit="contain"
                                                                alt={lang.code}
                                                            />
                                                            {lang.value}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                            <div className={styles.buttons}>
                                                <div 
                                                    className={styles.applyBtn}
                                                    onClick={apply}
                                                >
                                                    Apply Settings
                                                </div>
                                                <div 
                                                    className={styles.resetBtn}
                                                    onClick={reset}
                                                >
                                                    Reset
                                                </div>
                                            </div>
                                        </>
                                    }
                                </AnimatePresence>
                                <AnimatePresence>
                                    {page == 2 && 
                                        <>
                                            <motion.div 
                                                initial={{opacity:0}}
                                                animate={{opacity:1}}
                                                exit={{opacity:0}}
                                                transition={{duration:0.2, ease:"easeInOut"}}
                                                className={styles.bubblesWrap}
                                            >
                                                <div className={styles.bubblesBlock}>
                                                    {countries?.map(country => (
                                                        <div 
                                                            key={`country-${country.id}`}
                                                            className={`${styles.langBubble} ${country.code==countrySelected && styles.activeBubble}`}
                                                            onClick={()=>{
                                                                country_id.current = country.code
                                                                setCountrySelected(country.code)
                                                            }}
                                                        >
                                                            <Image
                                                                src={`${process.env.IMAGE_URL}/${country.flag_source}`}
                                                                width={27}
                                                                height={20}
                                                                objectFit="contain"
                                                                alt={country.code}
                                                            />
                                                            {country.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                            <div className={styles.buttons}>
                                                <div 
                                                    className={styles.applyBtn}
                                                    onClick={apply}
                                                >
                                                    Apply Settings
                                                </div>
                                                <div 
                                                    className={styles.resetBtn}
                                                    onClick={reset}
                                                >
                                                    Reset
                                                </div>
                                            </div>
                                        </>
                                    }
                                </AnimatePresence>
                            </motion.div>
                        }
                    </>
                }
            </AnimatePresence>
        </div>
    )
}