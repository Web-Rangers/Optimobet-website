import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles/pages/SearchResults.module.css'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import CheckboxFilter from '../../components/filters/CheckboxFilter'
import Stars from '../../components/Stars'
import { ReactSVG } from 'react-svg'
import { useRouter } from 'next/router'
import Slot from '../../components/Slot'
import CasinoCard from '../../components/CasinoCard'
import APIRequest from '../../functions/requests/APIRequest'
import useUserInfo from '../../hooks/useUserInfo'

const filters = [
    {
        name: 'Countries',
        items: [
            {
                id: 1,
                name: "Georgia"
            },
            {
                id: 2,
                name: "US"
            },
            {
                id: 3,
                name: "Canada"
            },
            {
                id: 4,
                name: "UK"
            }
        ]
    },
    {
        name: 'Games',
        items: [
            {
                id: 1,
                name: 'Slots'
            },
            {
                id: 2,
                name: 'Live Casino'
            },
            {
                id: 3,
                name: 'Table Games'
            },
            {
                id: 4,
                name: 'Poker'
            }
        ]
    },
    {
        name: 'Providers',
        items: [
            {
                id: 1,
                name: 'IVI Casino'
            },
            {
                id: 2,
                name: 'IG Casino'
            },
            {
                id: 3,
                name: 'VIP Casino'
            },
            {
                id: 4,
                name: 'V Casino'
            }
        ]
    },
    {
        name: 'Payment',
        items: [
            {
                id: 1,
                name: 'Online'
            },
            {
                id: 2,
                name: 'Cash'
            },
            {
                id: 3,
                name: 'Both'
            }
        ]
    },
    {
        name: 'Website Language',
        items: [
            {
                id: 1,
                name: 'Georgian',
            },
            {
                id: 2,
                name: 'English',
            },
            {
                id: 3,
                name: 'Russian',
            }
        ]
    },
    {
        name: 'Support Language',
        items: [
            {
                id: 1,
                name: 'Georgian',
            },
            {
                id: 2,
                name: 'English',
            },
            {
                id: 3,
                name: 'Russian',
            }
        ]
    }

]

export default function SearchResults({ providers }) {
    const [sidebarShown, setSidebarShown] = useState(true);
    const [filterCasino, setFilterCasino] = useState('All');
    const [filterBookmakers, setFilterBookmakers] = useState('All');
    const [filterSlots, setFilterSlots] = useState('All');
    const router = useRouter()
    const [selectedCat, setSelectedCat] = useState(0)
    const [categoriesOnSearch, setCategoriesOnSearch] = useState()
    const casinosRef = useRef()
    const bookmakersRef = useRef()
    const slotsRef = useRef()
    const [casinos, setCasinos] = useState([])
    const [bookmakers, setBookmakers] = useState([])
    const [slots, setSlots] = useState([])    
    const [casinosShowMore, setCasinosShowMore] = useState(false)
    const [bookmakersShowMore, setBookmakersShowMore] = useState(false)
    const [slotsShowMore, setSlotsShowMore] = useState(false)
    const user = useUserInfo()

    useEffect(()=>{
        if (router.query.text)
            APIRequest(`/search/result?q=${router.query.text}`, 'GET')
            .then(data => {
                setCategoriesOnSearch(
                    [
                        {
                            name: "All",
                            count: Object.entries(data).reduce(
                                (previousValue, currentValue) => (
                                    (typeof previousValue != "number" ? 
                                        previousValue[1] ? previousValue[1].length : 0
                                        : 
                                        previousValue
                                    ) 
                                    + 
                                    (currentValue[1] ? currentValue[1].length : 0)
                                )
                            )
                        }
                        ,
                        ...Object.entries(data).map(([key,value]) => (
                            {
                                name:key,
                                count:value.length
                            }
                        ))
                    ]
                )
                casinosRef.current = data.casinos
                setCasinos(data.casinos.slice(0,6))
                bookmakersRef.current = data.bookmakers
                setBookmakers(data.bookmakers.slice(0,6))
                slotsRef.current = data.slots.map(slot => (
                    {
                        ...slot,
                        provider: providers.filter(p => p.id == slot.provider_id)[0]?.name ?? null
                    }
                ))
                setSlots(slotsRef.current.slice(0,6))
            })
            .catch(err => {
                console.error(err)
            })
    },[router.query])

    useEffect(()=>{
        if (casinosRef.current) {
            let casinosSorted = [...casinosRef.current]
            switch (filterCasino) {
                case "Best in your country":
                    user?.country_id && (casinosSorted = casinosSorted.filter(casino => casino.countries.find(country => country.id === user.country_id)))
                    casinosSorted.sort((a, b) => b.rating - a.rating);
                    break;
                case "Recently added":
                    casinosSorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case "Highly recommended":
                    casinosSorted.sort((a, b) => b.reputation - a.reputation);
                    break;
                case "Best of the world":
                    casinosSorted.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    break;
            }
            setCasinos(casinosShowMore ? casinosSorted : casinosSorted.slice(0,6))
        }        
    },[filterCasino, casinosShowMore])

    useEffect(()=>{
        if (bookmakersRef.current) {
            let bookmakersSorted = [...bookmakersRef.current]
            switch (filterBookmakers) {
                case "Best in your country":
                    user?.country_id && (bookmakersSorted = bookmakersSorted.filter(casino => casino.countries.find(country => country.id === user.country_id)))
                    bookmakersSorted.sort((a, b) => b.rating - a.rating);
                    break;
                case "Recently added":
                    bookmakersSorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case "Highly recommended":
                    bookmakersSorted.sort((a, b) => b.reputation - a.reputation);
                    break;
                case "Best of the world":
                    bookmakersSorted.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    break;
            }
            setBookmakers(bookmakersShowMore ? bookmakersSorted : bookmakersSorted.slice(0,6))
        }        
    },[filterBookmakers, bookmakersShowMore])

    useEffect(()=>{
        if (slotsRef.current) {
            let slotsSorted = [...slotsRef.current]
            switch (filterSlots) {
                case 'New':
                    slotsSorted.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
                    break;
                case 'Popular':
                    slotsSorted.sort((a,b) => b.popularity - a.popularity)
                    break;
                case 'Promotions':
                    slotsSorted.sort((a,b) => b.promotions - a.promotions)
                    break;
                default:
                    break;
            }
            setSlots(slotsShowMore ? slotsSorted : slotsSorted.slice(0,6))
        }        
    },[filterSlots, slotsShowMore])

    const selectCategoryForFilters = (category) => {
        setSelectedCat(category)
    }

    const controlVariants = {
        left: {
            left: 0,
            right: 'unset'
        },
        right: {
            left: 'unset',
            right: 0
        }
    }

    const sidebarVariants = {
        shown: {
            opacity: [0, 1],
            transition: {
                duration: 0.5,
            }
        },
        hidden: {
            opacity: [1, 0],
            transition: {
                duration: 0.5,
            }
        }
    }

    const contentVariants = {
        wide: {
            marginLeft: 0,
            width: '100%',
            transition: {
                duration: 0.5,
            }
        },
        narrow: {
            marginLeft: 'calc(20% + 30px)',
            width: '80%',
            transition: {
                duration: 0.5,
            }
        }
    }

    const filterVariants = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 0,
        }
    }

    const resultCasinosVariants = {
        title: {
            marginTop: "72px"
        },
        controls: {
            marginTop: "62px"
        }
    }

    function renderSlots(sidebarShown) {
        // breaks the layout when first slot is big
        let column = 1;
        let row = 1;
        const maxColumns = sidebarShown ? 3 : 4;
        return slots.map((item, index) => {
            const slot = <Slot
                {...item}
                key={`slot_${item.id}`}
                // big={index === 0}
                style={{
                    gridColumnStart: column,
                    gridColumnEnd: column + 1,
                    gridRowStart: row,
                    gridRowEnd: row + 1,
                }}
            />
            // if (index === 0) {
            //     column = 3;
            //     return slot;
            // }
            column < maxColumns ? column++ : (column = 1, row++)
            return slot
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchHeader}>
                <h1>
                    Search Results for: "<span>{router.query.text}</span>"
                </h1>
            </div>
            <div className={styles.contentContainer}>
                <AnimatePresence
                    initial={false}
                >
                    {sidebarShown && <motion.div
                        variants={sidebarVariants}
                        animate="shown"
                        exit="hidden"
                        className={styles.filters}
                    >
                        <div className={styles.sticky}>
                            <div className={styles.filterHeader}>
                                <Image
                                    src={'/images/icons/filter.svg'}
                                    height={20}
                                    width={20}
                                />
                                FILTER
                            </div>
                            <CategoryFilter
                                currentCategory={selectedCat}
                                categories={categoriesOnSearch}
                                selectCategory={selectCategoryForFilters}
                            />
                            {/* <motion.div
                                initial={'closed'}
                                variants={filterVariants}
                                animate={selectedCat > 0 ? 'open' : 'closed'}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className={styles.filterContainer}
                            >
                                {filters.map((filter, index) => (
                                    <CheckboxFilter
                                        key={filter.name}
                                        title={filter.name}
                                        items={filter.items}
                                        initialOpen={false}
                                        collapsible
                                    />
                                ))}
                            </motion.div> */}
                        </div>
                    </motion.div>}
                </AnimatePresence>
                <motion.div
                    variants={contentVariants}
                    animate={sidebarShown ? 'narrow' : 'wide'}
                    className={styles.content}
                >
                    <AnimatePresence initial={false}>
                        <LayoutGroup>                        
                        {categoriesOnSearch && casinos && casinos.length>0 && (categoriesOnSearch[selectedCat].name == "casinos" || selectedCat == 0) &&
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div style={{ position: "relative" }}>
                                    <AnimatePresence initial={false}>
                                        {selectedCat == 0 && casinos.length>0 &&
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={styles.categoryHeaderResults}
                                                style={{ position: "absolute" }}
                                            >
                                                <span className={styles.secondName}>
                                                    Second name
                                                </span>
                                                <span className={styles.mainName}>
                                                    Online casinos
                                                </span>
                                            </motion.div>
                                        }
                                    </AnimatePresence>
                                    <AnimatePresence>
                                        {selectedCat != 0 &&
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={styles.controls}
                                                style={{ position: "absolute", width: "100%" }}
                                            >
                                                <div
                                                    className={styles.sidebarControls}
                                                    onClick={() => setSidebarShown(!sidebarShown)}
                                                >
                                                    <motion.div
                                                        variants={controlVariants}
                                                        animate={sidebarShown ? 'left' : 'right'}
                                                        className={styles.sidebarControlsSlide}
                                                    />
                                                    <div className={styles.sidebarControlsItem}>
                                                        <ReactSVG
                                                            src='/images/icons/layout-sidebar.svg'
                                                            className={sidebarShown ? styles.light : styles.dark}
                                                            height={24}
                                                            width={24}
                                                        />
                                                    </div>
                                                    <div className={styles.sidebarControlsItem}>
                                                        <ReactSVG
                                                            src='/images/icons/layout-sidebar-left-collapse.svg'
                                                            className={sidebarShown ? styles.dark : styles.light}
                                                            height={24}
                                                            width={24}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.filterControls}>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterCasino === 'All' && styles.active}`}
                                                        onClick={() => setFilterCasino('All')}
                                                    >
                                                        All
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterCasino === 'Best in your country' && styles.active}`}
                                                        onClick={() => setFilterCasino('Best in your country')}
                                                    >
                                                        Best in your country
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterCasino === 'Recently added' && styles.active}`}
                                                        onClick={() => setFilterCasino('Recently added')}
                                                    >
                                                        Recently added
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterCasino === 'Highly recommended' && styles.active}`}
                                                        onClick={() => setFilterCasino('Highly recommended')}
                                                    >
                                                        Highly recommended
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterCasino === 'Best of the world' && styles.active}`}
                                                        onClick={() => setFilterCasino('Best of the world')}
                                                    >
                                                        Best of the world
                                                    </div>
                                                </div>
                                            </motion.div>
                                        }
                                    </AnimatePresence>
                                </div>
                                <motion.div
                                    variants={resultCasinosVariants}
                                    initial={"title"}
                                    animate={selectedCat == 0 ? "title" : "controls"}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className={styles.casinos}
                                >
                                    {
                                        casinos.map(casino => {
                                            console.log(casino)
                                            return <CasinoCard 
                                                {...casino.casino} 
                                                shared_content={{...casino}} 
                                                games={casino?.casino?.games}
                                                website_language={casino?.casino?.website_language}
                                                support_language={casino?.casino?.support_language}
                                                key={`${casino.name}-${casino.id}`} 
                                            />
})
                                    }
                                </motion.div>
                                <div 
                                    className={styles.showMore}
                                    style={(casinos.length==casinosRef.current.length || casinosShowMore) ? {display:"none"} : {}}
                                    onClick={()=>setCasinosShowMore(true)}
                                >
                                    Show more
                                </div>
                            </motion.div>
                        }
                        {categoriesOnSearch && bookmakers && bookmakers.length>0 && (categoriesOnSearch[selectedCat].name == "bookmakers" || selectedCat == 0) &&
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div style={{ position: "relative" }}>
                                    <AnimatePresence initial={false}>
                                        {selectedCat == 0 && bookmakers.length>0 &&
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={styles.categoryHeaderResults}
                                                style={{ position: "absolute" }}
                                            >
                                                <span className={styles.secondName}>
                                                    Second name
                                                </span>
                                                <span className={styles.mainName}>
                                                    Bookmakers
                                                </span>
                                            </motion.div>
                                        }
                                    </AnimatePresence>
                                    <AnimatePresence>
                                        {selectedCat != 0 &&
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={styles.controls}
                                                style={{ position: "absolute", width: "100%" }}
                                            >
                                                <div
                                                    className={styles.sidebarControls}
                                                    onClick={() => setSidebarShown(!sidebarShown)}
                                                >
                                                    <motion.div
                                                        variants={controlVariants}
                                                        animate={sidebarShown ? 'left' : 'right'}
                                                        className={styles.sidebarControlsSlide}
                                                    />
                                                    <div className={styles.sidebarControlsItem}>
                                                        <ReactSVG
                                                            src='/images/icons/layout-sidebar.svg'
                                                            className={sidebarShown ? styles.light : styles.dark}
                                                            height={24}
                                                            width={24}
                                                        />
                                                    </div>
                                                    <div className={styles.sidebarControlsItem}>
                                                        <ReactSVG
                                                            src='/images/icons/layout-sidebar-left-collapse.svg'
                                                            className={sidebarShown ? styles.dark : styles.light}
                                                            height={24}
                                                            width={24}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.filterControls}>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterBookmakers === 'All' && styles.active}`}
                                                        onClick={() => setFilterBookmakers('All')}
                                                    >
                                                        All
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterBookmakers === 'Best in your country' && styles.active}`}
                                                        onClick={() => setFilterBookmakers('Best in your country')}
                                                    >
                                                        Best in your country
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterBookmakers === 'Recently added' && styles.active}`}
                                                        onClick={() => setFilterBookmakers('Recently added')}
                                                    >
                                                        Recently added
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterBookmakers === 'Highly recommended' && styles.active}`}
                                                        onClick={() => setFilterBookmakers('Highly recommended')}
                                                    >
                                                        Highly recommended
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterBookmakers === 'Best of the world' && styles.active}`}
                                                        onClick={() => setFilterBookmakers('Best of the world')}
                                                    >
                                                        Best of the world
                                                    </div>
                                                </div>
                                            </motion.div>
                                        }
                                    </AnimatePresence>
                                </div>
                                <motion.div
                                    variants={resultCasinosVariants}
                                    initial={"title"}
                                    animate={selectedCat == 0 ? "title" : "controls"}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className={styles.casinos}
                                >
                                    {
                                        bookmakers.map(casino => (
                                            <CasinoCard 
                                                {...casino.casino} 
                                                shared_content={{...casino}} 
                                                games={casino?.casino?.games}
                                                website_language={casino?.casino?.website_language}
                                                support_language={casino?.casino?.support_language}
                                                key={`${casino.name}-${casino.id}`} 
                                            />
                                        ))
                                    }
                                </motion.div>
                                <div 
                                    className={styles.showMore}
                                    style={(bookmakers.length==bookmakersRef.current.length || bookmakersShowMore) ? {display:"none"} : {}}
                                    onClick={()=>setBookmakersShowMore(true)}
                                >
                                    Show more
                                </div>
                            </motion.div>
                        }
                        {categoriesOnSearch && (categoriesOnSearch[selectedCat].name == "slots" || selectedCat == 0) &&
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div style={{ position: "relative" }}>
                                    <AnimatePresence initial={false}>
                                        {selectedCat == 0 && slots.length>0 &&
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={styles.categoryHeaderResults}
                                                style={{ position: "absolute" }}
                                            >
                                                <span className={styles.secondName}>
                                                    Second name
                                                </span>
                                                <span className={styles.mainName}>
                                                    Slots
                                                </span>
                                            </motion.div>
                                        }
                                    </AnimatePresence>
                                    <AnimatePresence>
                                        {selectedCat != 0 &&
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={styles.controls}
                                                style={{ position: "absolute", width: "100%" }}
                                            >
                                                <div
                                                    className={styles.sidebarControls}
                                                    onClick={() => setSidebarShown(!sidebarShown)}
                                                >
                                                    <motion.div
                                                        variants={controlVariants}
                                                        animate={sidebarShown ? 'left' : 'right'}
                                                        className={styles.sidebarControlsSlide}
                                                    />
                                                    <div className={styles.sidebarControlsItem}>
                                                        <ReactSVG
                                                            src='/images/icons/layout-sidebar.svg'
                                                            className={sidebarShown ? styles.light : styles.dark}
                                                            height={24}
                                                            width={24}
                                                        />
                                                    </div>
                                                    <div className={styles.sidebarControlsItem}>
                                                        <ReactSVG
                                                            src='/images/icons/layout-sidebar-left-collapse.svg'
                                                            className={sidebarShown ? styles.dark : styles.light}
                                                            height={24}
                                                            width={24}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.filterControls}>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterSlots === 'All' && styles.active}`}
                                                        onClick={() => setFilterSlots('All')}
                                                    >
                                                        All
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterSlots === 'New' && styles.active}`}
                                                        onClick={() => setFilterSlots('New')}
                                                    >
                                                        New
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterSlots === 'Popular' && styles.active}`}
                                                        onClick={() => setFilterSlots('Popular')}
                                                    >
                                                        Popular
                                                    </div>
                                                    <div
                                                        className={`${styles.filterControlsItem} ${filterSlots === 'Promotions' && styles.active}`}
                                                        onClick={() => setFilterSlots('Promotions')}
                                                    >
                                                        Promotions
                                                    </div>
                                                </div>
                                            </motion.div>
                                        }
                                    </AnimatePresence>
                                </div>
                                <motion.div
                                    variants={resultCasinosVariants}
                                    initial={"title"}
                                    animate={selectedCat == 0 ? "title" : "controls"}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    style={!sidebarShown ? { gridTemplateColumns: "repeat(4, 1fr)" } : {}}
                                    className={styles.slots}
                                >
                                    {slots && renderSlots(sidebarShown)}
                                </motion.div>
                                <div 
                                    className={styles.showMore}
                                    style={(slots.length==slotsRef.current.length || slotsShowMore) ? {display:"none"} : {}}
                                    onClick={()=>setSlotsShowMore(true)}
                                >
                                    Show more
                                </div>
                            </motion.div>
                        }
                        </LayoutGroup>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}

function CategoryFilter({
    categories = [],
    selectCategory,
    currentCategory = 0
}) {
    const [selectedCat, setSelectedCat] = useState(currentCategory)

    useEffect(() => {
        selectCategory && selectCategory(selectedCat)
    }, [selectedCat])

    return (
        <div className={styles.categoriesFilter}>
            <span className={styles.categoriesTitle}>
                Category
            </span>
            <div className={styles.categoriesList}>
                {categories && categories.length > 0 && categories.map((cat, index) => (
                    <div
                        className={`${styles.category} ${index == selectedCat && styles.activeCategory}`}
                        key={index}
                        onClick={() => setSelectedCat(index)}
                        style={cat.count>0 ? {} : {display:"none"}}
                    >
                        <span>
                            {cat.name}
                        </span>
                        <span className={styles.categoryCount}>
                            {cat.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const providers = await APIRequest('/nolimit/providers', 'GET')

    return {
        props: {
            providers
        },
        revalidate: 10,
    }
}

SearchResults.withHeader = true;
SearchResults.withFooter = true;