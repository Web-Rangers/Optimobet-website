import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/components/Language.module.css'
import Dropdown from './Dropdown'
import { motion, AnimatePresence } from 'framer-motion'
import APIRequest from '../functions/requests/APIRequest'
import useUserInfo from '../hooks/useUserInfo'
import { useRouter } from 'next/router'

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
    const [open, setOpen] = useState(false)
    const [countries, setCountries] = useState()
    const user = useUserInfo();
    const country_id = useRef('GE')
    const language_id = useRef('EN')
    const router = useRouter();
    const blockRef = useRef()

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
                    <motion.div
                        className={styles.languageSelector}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
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
                }
            </AnimatePresence>
        </div>
    )
}