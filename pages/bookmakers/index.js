import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles/pages/Bookmakers.module.css'
import { AnimatePresence, motion } from 'framer-motion';
import CheckboxFilter from '../../components/filters/CheckboxFilter';
import Stars from '../../components/Stars';
import { ReactSVG } from 'react-svg';
import APIRequest from '../../functions/requests/APIRequest';
import useUserInfo from '../../hooks/useUserInfo';

const filters = [
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

const casinos = [
    {
        name: 'IVI Casino',
        rating: 4.5,
        tags: ['Popular', 'Deposit Bonus', 'Mobile Devices Supported'],
        games: ['Slots', 'Live Casino', 'Table Games', 'Poker']
    },
    {
        name: 'IG Casino',
        rating: 4.5,
        tags: ['Popular', 'Deposit Bonus', 'Mobile Devices Supported'],
        games: ['Slots', 'Live Casino', 'Table Games', 'Poker']
    },
    {
        name: 'VIP Casino',
        rating: 4.5,
        tags: ['Popular', 'Deposit Bonus', 'Mobile Devices Supported'],
        games: ['Slots', 'Live Casino', 'Table Games', 'Poker']
    },
    {
        name: 'V Casino',
        rating: 4.5,
        tags: ['Popular', 'Deposit Bonus', 'Mobile Devices Supported'],
        games: ['Slots', 'Live Casino', 'Table Games', 'Poker']
    }
]

const slides = [1, 2, 3, 4, 5]

export default function BookmakersPage({ bookmakers, filters }) {
    const bookmakersRef = useRef(bookmakers);
    const [sidebarShown, setSidebarShown] = useState(true);
    const [sort, setSort] = useState('All');
    const [page, setPage] = useState(1);
    const [filteredItems, setFilteredItems] = useState(bookmakers);
    const loadMoreRef = useRef(null);
    const user = useUserInfo()

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

    function handleFilterByCategory(item, filterName) {
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
            case "BestInCountry":
                newFilteredItems = filteredItems.filter(casino => casino.countries.find(country => country.id === user.country_id));
                newFilteredItems.sort((a, b) => b.rating - a.rating);
                setFilteredItems(newFilteredItems);
                break;
            case "BestInWorld":
                newFilteredItems.sort((a, b) => b.rating - a.rating);
                setFilteredItems(newFilteredItems);
                break;
            case "Recent":
                newFilteredItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setFilteredItems(newFilteredItems);
                break;
            case 'Recommended':
                newFilteredItems.sort((a, b) => b.reputation - a.reputation);
                setFilteredItems(newFilteredItems);
                break;
        }
    }

    function loadMore() {
        APIRequest(`/bookmakers?page=${page + 1}`, 'GET')
            .then(res => {
                setPage(page++);
                bookmakersRef.current = [...bookmakersRef.current, ...res.data]
                setFilteredItems(bookmakersRef.current);
            })
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            }
        )
        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [])

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
                                className={`${styles.filterControlsItem} ${sort === 'BestInCountry' && styles.active}`}
                                onClick={() => handleSort('BestInCountry')}
                            >
                                Best in your country
                            </div>
                            <div
                                className={`${styles.filterControlsItem} ${sort === 'Recent' && styles.active}`}
                                onClick={() => handleSort('Recent')}
                            >
                                Recently added
                            </div>
                            <div
                                className={`${styles.filterControlsItem} ${sort === 'Recommended' && styles.active}`}
                                onClick={() => handleSort('Recommended')}
                            >
                                Highly recommended
                            </div>
                            <div
                                className={`${styles.filterControlsItem} ${sort === 'BestInWorld' && styles.active}`}
                                onClick={() => handleSort('BestInWorld')}
                            >
                                Best of the world
                            </div>
                        </div>
                    </div>
                    <div className={styles.casinos}>
                        {
                            filteredItems.map(bookmaker => (
                                <Casino {...bookmaker} key={bookmaker.id} />
                            ))
                        }
                        {filteredItems.length > 5 && <div ref={loadMoreRef} />}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function Casino({
    claim_bonus_url,
    features,
    positives,
    rating,
    support_language,
    website_language,
    url,
    games,
    shared_content,
    id
}) {
    return (
        <div className={styles.casino}>
            <a className={styles.casinoImage}>
                <Image
                    src="/images/casino.png"
                    layout='fill'
                    objectFit='cover'
                />
            </a>
            <div className={styles.casinoInfo}>
                <div className={styles.casinoColumn}>
                    <div className={styles.casinoName}>
                        <span className={styles.casinoNameText}>{shared_content.name}</span>
                        <div className={styles.casinoRating}>
                            <Stars points={rating} />
                        </div>
                    </div>
                    <div className={styles.casinoTags}>
                        {
                            features.map(tag => (
                                <div className={styles.casinoTag} key={tag}>
                                    <Image
                                        src="/images/icons/circle-check.svg"
                                        height={24}
                                        width={24}
                                    />
                                    {tag}
                                </div>
                            ))
                        }
                    </div>
                    <span className={styles.subtitle}>
                        Available games
                    </span>
                    <div className={styles.casinoGames}>
                        {
                            games?.slice(0, 5).map(game => (
                                <div className={styles.casinoGame} key={game.id} >
                                    <Image
                                        src={`/images/${game.slug}`}
                                        layout='fill'
                                        objectFit='cover'
                                        alt={game.name}
                                    />
                                </div>
                            ))
                        }
                        {games?.length > 5 && <div className={styles.casinoGame} >
                            +{games?.length - 5}
                        </div>}
                    </div>
                </div>
                <div className={`${styles.casinoColumn} ${styles.right}`}>
                    <div className={styles.casinoLanguages}>
                        <div className={styles.languageContainer}>
                            <span className={styles.languageTitle}>Website</span>
                            <div className={styles.languageContent}>
                                <div className={styles.language}>
                                    <Image
                                        src={`/images/icons/${website_language[0]?.code}`}
                                        alt={website_language[0]?.name}
                                        height={20}
                                        width={27}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.languageContainer}>
                            <span className={styles.languageTitle}>Live chat</span>
                            <div className={styles.languageContent}>
                                <Image
                                    src={`/images/icons/${support_language[0]?.code}`}
                                    alt={support_language[0]?.name}
                                    height={20}
                                    width={27}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.casinoButtons}>
                        <div className={styles.casinoButton}>
                            T&C Apply
                        </div>
                        <a
                            href={claim_bonus_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={`${styles.casinoButton} ${styles.highlighted}`}
                        >
                            Get Bonus
                        </a>
                    </div>
                </div>
            </div>
        </div >
    )
}

export async function getStaticProps() {
    const bookmakers = await APIRequest('/bookmakers', 'GET')
    const languages = await APIRequest('/languages', 'GET')
    const games = await APIRequest('/games', 'GET')
    const countries = await APIRequest('/countries', 'GET')
    const providers = await APIRequest('/providers', 'GET')

    return {
        props: {
            bookmakers: bookmakers.data,
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