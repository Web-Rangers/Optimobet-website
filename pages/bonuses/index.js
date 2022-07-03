import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react'
import { SwiperSlide } from 'swiper/react';
import SliderWithControls from '../../components/SliderWithControls';
import styles from '../../styles/pages/Bonuses.module.css'
import { AnimatePresence, motion } from 'framer-motion';
import CheckboxFilter from '../../components/filters/CheckboxFilter';
import Stars from '../../components/Stars';
import { ReactSVG } from 'react-svg';
import APIRequest from '../../functions/requests/APIRequest'
import Link from 'next/link'
import { BeatLoader } from 'react-spinners'
import BonusCard from '../../components/BonusCard'
import useUserInfo from '../../hooks/useUserInfo'
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

export default function BonusesPage({ filters }) {
    const [bonuses, setBonuses] = useState([]);
    const [sidebarShown, setSidebarShown] = useState(true);
    const [sort, setSort] = useState('All');
    const bonusesRef = useRef(bonuses);
    const [filteredItems, setFilteredItems] = useState(bonuses);
    const [page, setPage] = useState(1);
    const loadMoreRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const user = useUserInfo();
    const { width } = useWindowSize();

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

    function handleSort(filter) {
        setSort(filter);
        let newFilteredItems = [...filteredItems];
        switch (filter) {
            case 'All':
                setFilteredItems(bonuses);
                break;
            case "BestInCountry":
                user?.country_id && (newFilteredItems = filteredItems.filter(casino => casino.bonusable.countries.find(country => country.id === user.country_id)));
                newFilteredItems.sort((a, b) => b.bonusable.rating - a.bonusable.rating);
                setFilteredItems(newFilteredItems);
                break;
            case "BestInWorld":
                newFilteredItems.sort((a, b) => b.bonusable.rating - a.bonusable.rating);
                setFilteredItems(newFilteredItems);
                break;
            case "Recent":
                newFilteredItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setFilteredItems(newFilteredItems);
                break;
            case 'Recommended':
                newFilteredItems.sort((a, b) => b.bonusable.reputation - a.bonusable.reputation);
                setFilteredItems(newFilteredItems);
                break;
        }
    }

    function loadMore() {
        setLoading(true);
        APIRequest(`/bonuses?page=${page + 1}`, 'GET')
            .then(res => {
                setPage(page++);
                let newDataF = [...res.data]
                switch (filter) {
                    case "Best in your country":
                        user?.country_id && (newDataF = newDataF.filter(bonus => bonus.bonusable?.countries?.find(country => country.id === user.country_id)));
                        newDataF = newDataF.sort((a, b) => (b.best_for_you - a.best_for_you))
                        break;
                    case "Recently added":
                        newDataF = newDataF.sort((a, b) => (new Date(b.created_at) - new Date(a.created_at)))
                        break;
                    case "Best of the world":
                        newDataF = newDataF.sort((a, b) => (b.best_for_you - a.best_for_you))
                        break;
                    default:
                        break;
                }
                setFilteredItems([...bonusesRef.current, ...newDataF]);
                bonusesRef.current = [...bonusesRef.current, ...res.data]
                setLoading(false);
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

        APIRequest('/bonuses', 'GET')
            .then(res => {
                setBonuses(res.data);
                bonusesRef.current = res.data;
                setFilteredItems(res.data);
                observer.observe(loadMoreRef.current);
            })
            .catch(err => console.log(err))
        return () => observer.disconnect();
    }, [])

    return (
        <div className={styles.container}>
            <div>
                {bonuses.length > 0 && <SliderWithControls loop>
                    {
                        bonuses.slice(0, 10).map(slide => (
                            <SwiperSlide
                                key={`slide_${slide.id}`}
                                className={styles.sliderBlock}
                            >
                                <div>
                                    <Image
                                        className={styles.sliderPicture}
                                        src={`${process.env.IMAGE_URL}/${slide.bonusable.image_source}`}
                                        layout='fill'
                                        objectFit='contain'
                                    />
                                </div>
                            </SwiperSlide>
                        ))
                    }
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
                            filters?.map((filter, index) => (
                                <CheckboxFilter
                                    key={filter.name}
                                    title={filter.name}
                                    items={filter.items}
                                    initialOpen={index === 0}
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
                                className={`${styles.filterControlsItem} ${sort === 'Best of the world' && styles.active}`}
                                onClick={() => handleSort('Best of the world')}
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
                            filteredItems.map((bonus, index) => (
                                <BonusCard {...bonus} key={`bonus_${bonus.id}_${index}`} />
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

export async function getStaticProps() {
    // const bonuses = await APIRequest('/bonuses', 'GET')

    return {
        props: {
            // bonuses: bonuses.data
        },
        revalidate: 10,
    }
}

BonusesPage.withHeader = true;
BonusesPage.withFooter = true;