import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/components/Search.module.css'
import Dropdown from './Dropdown'
import { motion, AnimatePresence } from 'framer-motion'
import Stars from '../components/Stars'
import Link from 'next/link'
import { useRouter } from 'next/router'
import debounce from '../functions/debounce'
import APIRequest from '../functions/requests/APIRequest'

export default function Search({ setBorder }) {
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState('All')
    const [searchValue, setSearchValue] = useState()
    const [results, setResults] = useState({
        casinos: [],
        bookmakers: [],
        slots: [],
    })
    const searchRef = useRef()
    const router = useRouter()

    useEffect(() => {
        searchRef.current.value = ""
        setSearchValue(null)
        setOpen(false)
    }, [router.asPath])

    const searchText = (e) => {
        setSearchValue(e.target.value)
        if (e.target.value.length > 0)
            APIRequest(`/search?q=${e.target.value}`, 'GET')
                .then(data => {
                    setResults(data)
                    setOpen(true)
                    setBorder(true)
                })
                .catch(err => {
                    console.log(err)
                    setResults(null)
                    setOpen(false)
                    setBorder(false)
                })
        else
            setOpen(false)
        setBorder(false)
    }

    function handleClear() {
        setSearchValue(null)
        searchRef.current.value = ""
        setOpen(false)
        setBorder(false)
    }

    return (
        <div className={styles.search}>
            <input
                type="text"
                placeholder="Search string"
                onChange={debounce(searchText, 1000)}
                ref={searchRef}
            />
            <div className={styles.icon}>
                {!open
                    ? <Image
                        src="/images/icons/search.svg"
                        width={24}
                        height={24}
                    />
                    :
                    <Image
                        src="/images/icons/close.svg"
                        width={24}
                        height={24}
                        onClick={handleClear}
                    />
                }
            </div>
            <AnimatePresence>
                {open &&
                    <motion.div
                        className={styles.searchResults}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={styles.searchCategories}>
                            <div className={`${styles.searchFilter} ${filter === 'All' && styles.active}`}
                                onClick={() => setFilter('All')}
                            >
                                All
                            </div>
                            <div className={`${styles.searchFilter} ${filter === 'Casinos' && styles.active}`}
                                onClick={() => setFilter('Casinos')}
                            >
                                Online Casinos
                            </div>
                            <div className={`${styles.searchFilter} ${filter === 'Bookmakers' && styles.active}`}
                                onClick={() => setFilter('Bookmakers')}
                            >
                                Bookmakers
                            </div>
                            <div className={`${styles.searchFilter} ${filter === 'Slots' && styles.active}`}
                                onClick={() => setFilter('Slots')}
                            >
                                Free slots
                            </div>
                        </div>
                        <div className={styles.resultList}>
                            {
                                (results.casinos?.length > 0) && (filter === 'All' || filter === 'Casinos') && <>
                                    <div className={styles.resultCategory}>
                                        <span className={styles.categoryTitle}>
                                            Casinos
                                        </span>
                                        <span className={styles.categoryCount}>
                                            {results.casinos.length}
                                        </span>
                                    </div>
                                    {results.casinos.slice(0, 4).map(res =>
                                        <SearchResult
                                            key={res.id}
                                            href={`/casinos/${res.id}`}
                                            name={res.name}
                                            rating={res.casino.rating}
                                            image_source={res.casino.image_source}
                                        />
                                    )}
                                </>
                            }
                            {
                                (results.bookmakers?.length > 0) && (filter === 'All' || filter === 'Bookmakers') > 0 && <>
                                    <div className={styles.resultCategory}>
                                        <span className={styles.categoryTitle}>
                                            Bookmakers
                                        </span>
                                        <span className={styles.categoryCount}>
                                            {results.bookmakers.length}
                                        </span>
                                    </div>
                                    {results.bookmakers.slice(0, 4).map(res =>
                                        <SearchResult
                                            key={res.id}
                                            href={res.casino.url || res.casino.website}
                                            name={res.name}
                                            rating={res.casino.rating}
                                            image_source={res.casino.image_source}
                                        />
                                    )}
                                </>
                            }
                            {
                                (results.slots?.length > 0) && (filter === 'All' || filter === 'Slots') > 0 && <>
                                    <div className={styles.resultCategory}>
                                        <span className={styles.categoryTitle}>
                                            Slots
                                        </span>
                                        <span className={styles.categoryCount}>
                                            {results.slots.length}
                                        </span>
                                    </div>
                                    {results.slots.slice(0, 4).map(res =>
                                        <SearchResult
                                            key={res.id}
                                            href={`/slots/${res.id}`}
                                            name={res.name}
                                            rating={res.score}
                                            image_source={res.image_source}
                                        />
                                    )}
                                </>
                            }
                        </div>
                        <Link href={{ pathname: `/searchresults`, query: { text: searchValue } }}>
                            <a className={styles.seeAllResults}>
                                See All Results
                            </a>
                        </Link>
                    </motion.div>
                }
            </AnimatePresence>
        </div >
    )
}

function SearchResult({ name, rating, href = "/", image_source }) {
    return (
        <Link href={href ?? '#'}>
            <a className={styles.resultContent}>
                <div className={styles.resultInfo}>
                    <div className={styles.resultLogo}>
                        <Image
                            src={`${process.env.IMAGE_URL}/${image_source}`}
                            layout="fill"
                            objectFit='cover'
                        />
                    </div>
                    <div className={styles.resultData}>
                        <span className={styles.resultName}>
                            {name}
                        </span>
                        <div className={styles.stars}>
                            <Stars points={rating} />
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    )
}
