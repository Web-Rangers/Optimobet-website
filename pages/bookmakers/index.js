import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles/pages/Bookmakers.module.css'
import { AnimatePresence, motion } from 'framer-motion';
import CheckboxFilter from '../../components/filters/CheckboxFilter';
import Stars from '../../components/Stars';
import { ReactSVG } from 'react-svg';
import APIRequest from '../../functions/requests/APIRequest';
import useUserInfo from '../../hooks/useUserInfo';
import { BeatLoader } from 'react-spinners';
import CasinoCard from '../../components/CasinoCard';
import useWindowSize from '../../hooks/useWindowSize';
import Dropdown from '../../components/Dropdown';
import { useRouter } from 'next/router';

const mobileFilters = [
    {
        id: '1',
        value: 'All',
    },
    {
        id: '2',
        value: 'Best in your country',
    },
    {
        id: '3',
        value: 'Recently added',
    },
    {
        id: '4',
        value: 'Highly recommended',
    },
    {
        id: '5',
        value: 'Best in the world',
    }
]

export default function BookmakersPage({ filters }) {
    const [bookmakers, setBookmakers] = useState([]);
    const bookmakersRef = useRef();
    const [sidebarShown, setSidebarShown] = useState(true);
    const [sort, setSort] = useState('All');
    const [page, setPage] = useState(1);
    const [filteredItems, setFilteredItems] = useState(bookmakers);
    const loadMoreRef = useRef(null);
    const user = useUserInfo()
    const [loading, setLoading] = useState(false);
    const { width } = useWindowSize();
    const router = useRouter();
    const queryString = new URLSearchParams(router.asPath.split('?')[1]).toString();


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
            marginLeft: 'calc(23% + 30px)',
            width: '80%',
            transition: {
                duration: 0.5,
            }
        }
    }

    const mobileButtonVariants = {
        shown: {
            backgroundColor: '#7F3FFC',
        },
        hidden: {
            backgroundColor: '#FFFFFF',
        }
    }

    function handleFilterByCategory(item, filterName) {
        if (item === null) {
            setFilteredItems(bookmakersRef.current);
            return
        }
        switch (filterName) {
            case 'Games':
                setFilteredItems(bookmakersRef.current.filter(casino => casino.games.find(game => game.id === item.id)));
                break;
            case 'Website Language':
                setFilteredItems(bookmakersRef.current.filter(casino => casino.website_language.find(lang => lang.id === item.id)));
                break;
            case 'Support Language':
                setFilteredItems(bookmakersRef.current.filter(casino => casino.support_language.find(lang => lang.id === item.id)));
                break;
            case 'Payment Methods':
                setFilteredItems(bookmakersRef.current.filter(casino => casino.payment_methods.find(payment => payment.id === item.id)));
                break;
            case 'Countries':
                setFilteredItems(bookmakersRef.current.filter(casino => casino.countries?.find(country => country.id === item.id)));
                break;
            case 'Providers':
                setFilteredItems(bookmakersRef.current.filter(casino => casino.providers?.find(provider => provider.id === item.id)));
                break;
            default:
                setFilteredItems(bookmakersRef.current);
                break;
        }
    }

    function handleSort(filter) {
        setSort(filter);
        let newFilteredItems = [...filteredItems];
        switch (filter) {
            case 'All':
                setFilteredItems(bookmakersRef.current);
                break;
            case "Best in your country":
                user?.country_id && (newFilteredItems = filteredItems.filter(casino => casino.countries.find(country => country.id === user.country_id)));
                newFilteredItems.sort((a, b) => b.rating - a.rating);
                setFilteredItems(newFilteredItems);
                break;
            case "Best of the world":
                newFilteredItems.sort((a, b) => b.rating - a.rating);
                setFilteredItems(newFilteredItems);
                break;
            case "Recently added":
                newFilteredItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setFilteredItems(newFilteredItems);
                break;
            case 'Highly recommended':
                newFilteredItems.sort((a, b) => b.reputation - a.reputation);
                setFilteredItems(newFilteredItems);
                break;
        }
    }

    function loadMore() {
        setLoading(true);
        APIRequest(`/bookmakers?page=${page + 1}&${queryString}`, 'GET')
            .then(res => {
                setPage(page++);
                setLoading(false);
                bookmakersRef.current = [...bookmakersRef.current, ...res.data]
                setFilteredItems(bookmakersRef.current);
            })
    }

    useEffect(() => {
        APIRequest(`/bookmakers?${queryString}`, 'GET')
            .then(res => {
                setBookmakers(res.data);
                bookmakersRef.current = res.data;
                setFilteredItems(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            }
        )

        bookmakers.length > 5 && observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [bookmakers])

    useEffect(() => {
        if (width <= 768) {
            setSidebarShown(false);
        }
    }, [width])

    return (
        <div className={styles.container}>
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
                        <span className={styles.filtersTitle}>
                            <Image
                                src={'/images/icons/filter.svg'}
                                height={20}
                                width={20}
                            />
                            Filters
                        </span>
                        {
                            width <= 768 && <div className={styles.mobileFilterHeader}>
                                <span>Filters</span>
                                <Image
                                    src="/images/icons/close.svg"
                                    width={24}
                                    height={24}
                                    onClick={() => setSidebarShown(false)}
                                />
                            </div>
                        }
                        {
                            filters.map((filter, index) => (
                                <CheckboxFilter
                                    key={filter.name}
                                    title={filter.name}
                                    items={filter.items}
                                    initialOpen={index === 0}
                                    onChange={(item) => handleFilterByCategory(item, filter.name)}
                                    collapsible
                                />
                            ))
                        }
                    </motion.div>}
                </AnimatePresence>
                <motion.div
                    variants={contentVariants}
                    animate={sidebarShown ? 'narrow' : 'wide'}
                    className={styles.content}
                >
                    <div className={styles.controls}>
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
                                className={`${styles.filterControlsItem} ${sort === 'All' && styles.active}`}
                                onClick={() => handleSort('All')}
                            >
                                All
                            </div>
                            <div
                                className={`${styles.filterControlsItem} ${sort === 'Best in your country' && styles.active}`}
                                onClick={() => handleSort('Best in your country')}
                            >
                                Best in your country
                            </div>
                            <div
                                className={`${styles.filterControlsItem} ${sort === 'Recently added' && styles.active}`}
                                onClick={() => handleSort('Recently added')}
                            >
                                Recently added
                            </div>
                            <div
                                className={`${styles.filterControlsItem} ${sort === 'Highly recommended' && styles.active}`}
                                onClick={() => handleSort('Highly recommended')}
                            >
                                Highly recommended
                            </div>
                            <div
                                className={`${styles.filterControlsItem} ${sort === 'Best of the world' && styles.active}`}
                                onClick={() => handleSort('Best of the world')}
                            >
                                Best of the world
                            </div>
                        </div>
                    </div>
                    <div className={styles.casinos}>
                        {
                            width <= 768 &&
                            <div className={styles.mobileFilters}>
                                <span className={styles.filtersTitle}>
                                    <Image
                                        src={'/images/icons/filter.svg'}
                                        height={20}
                                        width={20}
                                    />
                                    Filters
                                </span>
                                <Dropdown
                                    bordered={false}
                                    items={mobileFilters}
                                    onChange={(item) => handleSort(item.value)}
                                />
                            </div>
                        }
                        {
                            bookmakers.length > 0
                                ? filteredItems.map(bookmaker => (
                                    <CasinoCard basepath={'bookmakers'} {...bookmaker} key={bookmaker.id} />
                                ))
                                : <div className='preloader'>
                                    <BeatLoader color='#7F3FFC' />
                                </div>
                        }
                        {filteredItems.length > 5 && <div className={styles.loader} ref={loadMoreRef} >
                            <BeatLoader loading={loading} color='#7F3FFC' />
                        </div>}
                        {
                            width <= 768 &&
                            <motion.div
                                variants={mobileButtonVariants}
                                animate={sidebarShown ? 'shown' : 'hidden'}
                                className={styles.mobileFilterButton}
                                onClick={() => setSidebarShown(!sidebarShown)}
                            >
                                {
                                    sidebarShown
                                        ? `Filter (${filteredItems.length})`
                                        : <span className={styles.filtersTitle}>
                                            <Image
                                                src={'/images/icons/filter.svg'}
                                                height={20}
                                                width={20}
                                            />
                                            Filters
                                        </span>
                                }
                            </motion.div>
                        }
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export async function getStaticProps() {
    // const bookmakers = await APIRequest('/nolimit/bookmakers', 'GET')
    const languages = await APIRequest('/nolimit/languages', 'GET')
    const games = await APIRequest('/nolimit/games', 'GET')
    const countries = await APIRequest('/nolimit/countries', 'GET')
    const providers = await APIRequest('/nolimit/providers', 'GET')

    return {
        props: {
            // bookmakers: bookmakers.data,
            filters: [
                {
                    name: 'Popular filters',
                    items: [
                        {
                            id: 1,
                            name: 'No Deposit Bonus',
                        },
                        {
                            id: 2,
                            name: 'Deposit Bonus',
                        },
                        {
                            id: 3,
                            name: 'Mobile Devices Supported'
                        }
                    ],
                },
                {
                    name: 'Countries',
                    items: countries
                },
                {
                    name: 'Games',
                    items: games
                },
                {
                    name: 'Website Language',
                    items: languages
                },
                {
                    name: 'Support Language',
                    items: languages
                },
            ]
        },
        revalidate: 10,
    }
}

BookmakersPage.withHeader = true;
BookmakersPage.withFooter = true;