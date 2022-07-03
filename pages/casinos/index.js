import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { SwiperSlide } from 'swiper/react';
import SliderWithControls from '../../components/SliderWithControls';
import styles from '../../styles/pages/Casinos.module.css'
import { AnimatePresence, motion } from 'framer-motion';
import CheckboxFilter from '../../components/filters/CheckboxFilter';
import Stars from '../../components/Stars';
import { ReactSVG } from 'react-svg';
import APIRequest from '../../functions/requests/APIRequest';
import Link from 'next/link';
import useUserInfo from '../../hooks/useUserInfo';
import { BeatLoader } from 'react-spinners';
import CasinoCard from '../../components/CasinoCard'
import useWindowSize from '../../hooks/useWindowSize';
import Dropdown from '../../components/Dropdown';

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
        value: 'Best in the world',
    }
]

export default function CasinosPage({ filters }) {
    const [casinos, setCasinos] = useState([]);
    const casinosRef = useRef();
    const [sidebarShown, setSidebarShown] = useState(true);
    const [sort, setSort] = useState('All');
    const [filteredItems, setFilteredItems] = useState(casinos);
    const [page, setPage] = useState(1);
    const loadMoreRef = useRef(null);
    const user = useUserInfo();
    const [loading, setLoading] = useState(false);
    const { width } = useWindowSize();
    const [styleMainSlider, setStyleMainSlider] = useState()
    const [newCasinos, setNewCasinos] = useState([])

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
        if (item === null) {
            setFilteredItems(casinosRef.current);
            return
        }
        switch (filterName) {
            case 'Games':
                setFilteredItems(casinosRef.current.filter(casino => casino.games.find(game => game.id === item.id)));
                break;
            case 'Website Language':
                setFilteredItems(casinosRef.current.filter(casino => casino.website_language.find(lang => lang.id === item.id)));
                break;
            case 'Support Language':
                setFilteredItems(casinosRef.current.filter(casino => casino.support_language.find(lang => lang.id === item.id)));
                break;
            case 'Payment Methods':
                setFilteredItems(casinosRef.current.filter(casino => casino.payment_methods.find(payment => payment.id === item.id)));
                break;
            case 'Countries':
                setFilteredItems(casinosRef.current.filter(casino => casino.countries.find(country => country.id === item.id)));
                break;
            case 'Providers':
                setFilteredItems(casinosRef.current.filter(casino => casino.providers.find(provider => provider.id === item.id)));
                break;
            default:
                setFilteredItems(casinosRef.current);
                break;
        }
    }

    function handleSort(filter) {
        setSort(filter);
        let newFilteredItems = [...filteredItems];
        switch (filter) {
            case 'All':
                setFilteredItems(casinosRef.current);
                break;
            case "BestInCountry":
                user?.country_id && (newFilteredItems = filteredItems.filter(casino => casino.countries.find(country => country.id === user.country_id)));
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
        setLoading(true);
        APIRequest(`/casinos?page=${page + 1}`, 'GET')
            .then(res => {
                setPage(page++);
                setLoading(false);
                casinosRef.current = [...casinosRef.current, ...res.data]
                setFilteredItems(casinosRef.current);
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

        APIRequest('/home-components?type=new_casino')
            .then(res => setNewCasinos(res))
            .catch(err => console.log(err))
        
        APIRequest('/casinos', 'GET')
            .then(res => {
                setCasinos(res.data)
                casinosRef.current = res.data;
                setFilteredItems(res.data);
                observer.observe(loadMoreRef.current);
            })
            .catch(err => console.log(err))

        return () => observer.disconnect();
    }, [])

    useEffect(() => {
        let mainS = { height: 500 }
        if (width <= 1440) {
            mainS = { height: 480 }
        }     
        if (width <= 1280) {
            mainS = { height: 440 }
        }
        if (width <= 1024) {
            mainS = { height: 350 }
        }
        if (width <= 768) {
            mainS = { height: 570 }
        }
        if (width <= 425) {
            mainS = { height: 520 }
        }
        setStyleMainSlider(mainS)
    }, [width])

    return (
        <div className={styles.container}>
            <div>
                {casinos.length > 0 && 
                <SliderWithControls
                    styleWrap={styleMainSlider}
                    main
                >
                    {newCasinos.map((casino, index) => (
                        <SwiperSlide key={casino.id} className={styles.sliderBlock}>
                            <NewCasino 
                                {...casino} 
                                image_source={
                                    `/images/homePageimgs/${
                                        index>2 ? 
                                            ((index % 3 == 0) ? 
                                                "1" 
                                                : 
                                                ((index % 3 == 1) ? 
                                                    "2" 
                                                    : 
                                                    "3"
                                                ) 
                                            )
                                            : 
                                            (index+1)
                                    }.png`
                                } 
                                image_characters={
                                    `/images/homePageimgs/c${
                                        index>2 ? 
                                            ((index % 3 == 0) ? 
                                                "1" 
                                                : 
                                                ((index % 3 == 1) ? 
                                                    "2" 
                                                    : 
                                                    "3"
                                                ) 
                                            )
                                            : 
                                            (index+1)
                                    }.png`
                                }
                            />
                        </SwiperSlide>
                    ))}
                </SliderWithControls>}
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
                        <span className={styles.filtersTitle}>
                            <Image
                                src={'/images/icons/filter.svg'}
                                height={20}
                                width={20}
                            />
                            Filters
                        </span>
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
                            width <= 425 &&
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
                            filteredItems.map(casino => (
                                <CasinoCard {...casino} key={casino.name} />
                            ))
                        }
                        {filteredItems.length > 5 && <div className={styles.loader} ref={loadMoreRef} >
                            <BeatLoader loading={loading} color='#7F3FFC' />
                        </div>}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function NewCasino({ bonus_url, shared_content, features, id, claim_bonus_text, image_source, image_characters }) {
    return (
        <div className={styles.casino}>
            <div className={styles.casinoBg}>
                <Image
                    //src={`${process.env.IMAGE_URL}/${image_source}`}
                    src={image_source}
                    layout='fill'
                    objectFit='cover'
                />
            </div>
            <div className={styles.characters}>
                <Image
                    //src={`${process.env.IMAGE_URL}/${image_characters}`}
                    src={image_characters}
                    layout='fill'
                    objectFit='contain'
                    objectPosition='right bottom'
                />
            </div>
            <div className={styles.casinoInfo}>
                <div className={styles.bonusInfo}>

                    <span className={styles.bonusText}>
                        {claim_bonus_text || shared_content?.name}
                    </span>
                    {features.map(feature => (
                        <span
                            key={feature}
                            className={styles.feature}
                        >
                            {feature}
                        </span>
                    ))}
                </div>
                <div className={styles.casinoButtons}>
                    <a
                        href={bonus_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.bonusButton}
                    >
                        Get Bonus
                    </a>
                    <Link href={`/casinos/${id}`}>
                        <a className={styles.detailsButton}>
                            Details
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const languages = await APIRequest('/nolimit/languages', 'GET')
    const games = await APIRequest('/nolimit/games', 'GET')
    const payments = await APIRequest('/nolimit/payment-methods', 'GET')
    const countries = await APIRequest('/nolimit/countries', 'GET')
    const providers = await APIRequest('/nolimit/providers', 'GET')

    return {
        props: {
            // casinos: casinos.data,
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
                    name: 'Providers',
                    items: providers
                },
                {
                    name: 'Payment Methods',
                    items: payments
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

CasinosPage.withHeader = true;
CasinosPage.withFooter = true;