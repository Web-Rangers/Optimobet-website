import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/Home.module.css'

import { SwiperSlide } from 'swiper/react';
import SliderWithControls from '../components/SliderWithControls'

import PromoBlock from '../components/PromoBlock';
import SiteCard from '../components/SiteCard';
import CategoryBlock from '../components/CategoryBlock';
import { useEffect, useState } from 'react';

import useWindowSize from '../hooks/useWindowSize'
import Slot from '../components/Slot'
import APIRequest from '../functions/requests/APIRequest';
import Link from 'next/link';
import PromoBonusBlock from '../components/PromoBonusBlock';

const _slots = [
    {
        id: 1,
        name: 'Slot 1',
        provider: 'ELK Studio',
        type: 'Achievement',
        rating: 4.5,
    },
    {
        id: 2,
        name: 'Slot 2',
        provider: 'Netend',
        type: 'Megaways',
        rating: 4.5,
    },
    {
        id: 3,
        name: 'Slot 3',
        provider: 'YGGDRASIL',
        type: 'Bonus Buy',
        rating: 4.5,
    },
    {
        id: 4,
        name: 'Slot 4',
        provider: 'EGT',
        type: 'Sticky Features',
        rating: 4.5,
    },
    {
        id: 5,
        name: 'Slot 5',
        provider: 'PRAGMATICPLAY',
        type: 'Jackpot',
        rating: 4.5,
    },
    {
        id: 6,
        name: 'Slot 6',
        provider: 'Booming Games',
        type: 'Achievement',
        rating: 4.5,
    },
    {
        id: 7,
        name: 'Slot 7',
        provider: 'IRON DOG',
        type: 'Megaways',
        rating: 4.5,
    },
    {
        id: 8,
        name: 'Slot 8',
        provider: 'BETSOFT',
        type: 'Bonus Buy',
        rating: 4.5,
    },
    {
        id: 9,
        name: 'Slot 9',
        provider: '2by2gaming',
        type: 'Sticky Features',
        rating: 4.5,
    }
]

export default function Home({
    // newCasinos,
    // freeSlots,
    // betting,
    // exclusiveBonus,
    casinosCount,
    bookmakersCount,
    bonusesCount,
    slotsCount,
    countries,
    providers
}) {
    const { width, height } = useWindowSize()
    const [offsetSlots, setOffsetSlots] = useState()
    const [newCasinos, setNewCasinos] = useState([])
    const [freeSlots, setFreeSlots] = useState([])
    const [betting, setBetting] = useState([])
    const [exclusiveBonus, setExclusiveBonus] = useState([])
    const [exclusiveBetting, setExclusiveBetting] = useState([])
    const [exclusiveCasinos, setExclusiveCasinos] = useState([])
    const [percent, setPercent] = useState(0.8)
    const [styleMainSlider, setStyleMainSlider] = useState()
    const [styleSlotSlider, setStyleSlotSlider] = useState()
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        let perc = 0.8
        let mainS = { height: 500 }
        let slotS = { height: 500 }
        if (width <= 1440) {
            perc = 0.9
            mainS = { height: 480 }
            slotS = { height: 480 }
        }
        if (width <= 1366) {
            perc = 0.92
        }
        if (width <= 1280) {
            mainS = { height: 440 }
            slotS = { height: 400 }
        }
        if (width <= 1024) {
            mainS = { height: 350 }
        }
        if (width <= 768) {
            mainS = { height: 570 }
        }
        if (width <= 480) {
            mainS = { height: 520 }
        }
        setStyleMainSlider(mainS)
        setStyleSlotSlider(slotS)
        setPercent(perc)

        //const chunkSize = Math.trunc(width * perc / (290 + 19))
        const chunkSize = 4
        let offset = []
        for (let i = 0; i < freeSlots.length; i += chunkSize) {
            offset.push(freeSlots.slice(i, i + chunkSize))
        }
        setOffsetSlots(offset)
    }, [width, freeSlots])

    useEffect(() => {
        APIRequest('/home-components?type=casino_new')
            .then(res => setNewCasinos(res))
            .catch(err => console.log(err))
        APIRequest('/home-components?type=bonus_exclusive')
            .then(res => setExclusiveBonus(res))
            .catch(err => console.log(err))
        APIRequest('/home-components?type=slots_free')
            .then(res => setFreeSlots(res))
            .catch(err => console.log(err))
        APIRequest('/home-components?type=betting')
            .then(res => setBetting(res))
            .catch(err => console.log(err))
        APIRequest('/home-components?type=betting_exclusive')
            .then(res => setExclusiveBetting(res))
            .catch(err => console.log(err))
        APIRequest('/home-components?type=casino_exclusive')
            .then(res => setExclusiveCasinos(res))
        APIRequest('/sliders?page=home')
            .then(res => setSlides(res))
            .catch(err => console.log(err))
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>OPTIMOBET</title>
                <meta name="description" content="OPTIMOBET WEBSITE" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.mainSlider}>
                    {newCasinos.length > 0 &&
                        <SliderWithControls
                            styleWrap={styleMainSlider}
                            main
                        >
                            {slides.map((casino, index) => (
                                <SwiperSlide key={casino.id} className={styles.sliderBlock}>
                                    <NewCasino
                                        {...casino}
                                        image_source={`${process.env.IMAGE_URL}/${casino.image_bg_source}`}
                                        image_characters={`${process.env.IMAGE_URL}/${casino.image_source}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </SliderWithControls>}
                </div>

                <div className={styles.categoryBlocks}>
                    <CategoryBlock
                        name="Betting"
                        info={`${bookmakersCount} Bookmakers`}
                        image="/images/icons/cat-1.png"
                        bgColor="#00C69C4D"
                        href='/bookmakers'
                    />
                    <CategoryBlock
                        name="Casino"
                        info={`${casinosCount} Online casinos`}
                        image="/images/icons/cat-2.png"
                        bgColor="#7F3FFC4D"
                        href='/casinos'
                    />
                    <CategoryBlock
                        name="Gambling"
                        info={`${slotsCount} Free slots`}
                        image="/images/icons/cat-3.png"
                        bgColor="#FF84574D"
                        href='/slots'
                    />
                    <CategoryBlock
                        name="Bonus"
                        info={`${bonusesCount} Bonuses`}
                        image="/images/icons/cat-4.png"
                        bgColor="#FFC4484D"
                        href='/bonuses'
                    />
                </div>

                <div className={styles.promoBlocks}>
                    <div className={styles.BlocksHeader}>
                        <span className={styles.promoBlocksSubTitle}>
                            Bet and win
                        </span>
                        <span className={styles.promoBlocksTitle}>
                            Betting sites
                        </span>
                    </div>
                    <div className={styles.promoBlocksContent}>
                        {exclusiveBetting[0] && <PromoBlock
                            charactersImage="/images/main/7880-1.png"
                            bgColor="#7F3FFC"
                            {...exclusiveBetting[0]}
                            rating={exclusiveBetting[0].reputation}

                        />}
                        {exclusiveBetting[1] && <PromoBlock
                            charactersImage="/images/main/7880-2.png"
                            bgColor="#4B4453"
                            {...exclusiveBetting[1]}
                            rating={exclusiveBetting[1].reputation}
                        />}
                    </div>
                </div>

                <div className={styles.sitesGallery}>
                    {
                        betting.slice(0, width > 1024 ? 3 : 4).map(casino => (
                            <SiteCard
                                {...casino}
                                key={casino.id}
                                rep={casino.reputation}
                            />
                        ))
                    }
                    <div className={styles.promoInSites}>
                        {betting[3] && <PromoBlock
                            charactersImage="/images/main/7880-3.png"
                            bgColor="transparent linear-gradient(251deg, #FFC448 0%, #FF8457 100%) 0% 0% no-repeat padding-box"
                            charactersWidth={width > 1024 ? "60%" : null}
                            charactersHeight={width > 1024 ? null : "100%"}
                            {...betting[3]}
                            rating={betting[3].reputation}
                        />}
                    </div>
                    {
                        betting.slice(width > 1024 ? 4 : 5, 8).map(casino => (
                            <SiteCard
                                {...casino}
                                key={casino.id}
                                rep={casino.reputation}
                            />
                        ))
                    }
                    <div className={styles.moreButtonArea}>
                        <Link href="/bookmakers">
                            <a className={styles.moreButton}>
                                See More
                            </a>
                        </Link>
                    </div>
                </div>

                <div className={styles.sitesLine}>
                    <div className={styles.BlocksHeader}>
                        <span className={styles.promoBlocksSubTitle}>
                            second name
                        </span>
                        <span className={styles.promoBlocksTitle}>
                            online casinos
                        </span>
                    </div>
                    {
                        newCasinos.slice(0, 3).map(casino => (
                            <SiteCard
                                key={casino.id}
                                {...casino}
                                rep={casino.reputation}
                            />
                        ))
                    }
                    <div className={styles.moreButtonArea} style={{ marginTop: "24px" }}>
                        <Link href="/casinos">
                            <a className={styles.moreButton}>
                                See More
                            </a>
                        </Link>
                    </div>
                </div>

                <div className={styles.promoBlocks}>
                    <div className={styles.BlocksHeader}>
                        <span className={styles.promoBlocksSubTitle}>
                            second name
                        </span>
                        <span className={styles.promoBlocksTitle}>
                            exclusive bonus
                        </span>
                    </div>
                    <div className={styles.promoBlocksContent}>
                        {
                            exclusiveBonus.slice(0, 2).map((bonus, index) => (
                                <PromoBonusBlock
                                    key={bonus.id}
                                    {...bonus}
                                    charactersImage={`/images/main/7880-${index + 4}.png`}
                                    bgColor={index == 0 ? "#4B4453" : "#00C69C"}
                                    charactersWidth={index == 0 ? "55%" : null}
                                />
                            ))
                        }
                    </div>
                </div>

                {width > 1024 && <div className={styles.slotsSlider}>
                    <div className={styles.headerBlockWrap}>
                        <div className={styles.BlocksHeader}>
                            <span className={styles.promoBlocksSubTitle}>
                                second name
                            </span>
                            <span className={styles.promoBlocksTitle}>
                                free slots
                            </span>
                        </div>
                    </div>
                    {offsetSlots && offsetSlots.length > 0 &&
                        <SliderWithControls
                            styleWrap={styleSlotSlider}
                        >
                            {offsetSlots.map((item, index) => (
                                <SwiperSlide className={styles.slotBlock} key={index}>
                                    {item.map(slot => (
                                        <div
                                            style={{
                                                width: "calc((100% - " + 30 * (Math.trunc(width * percent / (290 + 19)) - 1) + "px)/" + Math.trunc(width * percent / (290 + 19)) + ")",
                                                flex: "initial",
                                                height: styleSlotSlider?.height || ""
                                            }}
                                            key={`slot_${slot.id}`}
                                        >
                                            <Slot
                                                {...slot}
                                            />
                                        </div>
                                    ))}
                                </SwiperSlide>
                            ))}
                        </SliderWithControls>
                    }
                </div>}

                <div className={styles.gamblingRules}>
                    <div className={styles.headerBlockWrap}>
                        <div className={styles.BlocksHeader}>
                            <span className={styles.promoBlocksSubTitle}>
                                second name
                            </span>
                            <span className={styles.promoBlocksTitle} style={{ textTransform: "initial" }}>
                                How to start gambling
                            </span>
                        </div>
                    </div>
                    <div className={styles.gamblingContent}>
                        <div className={styles.gamblingPicture}>
                            <Image
                                src="/images/main/Camel.png"
                                objectFit='contain'
                                layout='fill'
                            />
                        </div>
                        <ol className={styles.rulesList}>
                            <li>
                                Compare The Best Gambling Sites
                            </li>
                            <span>
                                Initially decide where to play, what and how. Optimobet.com assists you to find safe and exciting casino suitable games and strategies for your contentment. Our thoroughly formed lists and detailed overviews will guide you to every part of prominent online casinos that simplifies comparing sites and choices of your favourite games.
                            </span>
                            <span>
                                If you are new in the casino world you have everything you need. Our guides describe everything you want to know about online casinos : how to play various games, leading software providers and the most generous bonuses. You will definitely find what you were looking for with the help of Optimobet.com
                            </span>
                            <li>
                                Deposit
                            </li>
                            <span>
                                If you play with a non-deposit bonus, you need to deposit funds on your account before you can make any bets. You need to deposit a minimum sum to get a welcome bonus, so check out these conditions. Gambling sites which we recommend get various payment options from debit cards and bank transfers, to electronic wallets such as Neteller and Skrill. most of the deposits enroll on your account straight away. This means you can make a bet immediately.
                            </span>
                            <li>
                                Registration
                            </li>
                            <span>
                                Have you found the best site for gambling? Go on our link to get directly on the registration page. You can register within a few minutes. Everything you need to do is to provide some private information and contacts. Don’t forget to sign to get welcome bonus.
                            </span>
                            <li>
                                Make a bet
                            </li>
                            <span>
                                After depositing funds on your account, it’s time to make a bet. Can you imagine you chances on Blackjack? Want to support your favourite basketball team? Want to try your luck on betting on CS:GO? No matter what you want to bet on this sites, there is everything for everyone.
                            </span>
                        </ol>
                        <div className={styles.gamblingPicture}>
                            <Image
                                src="/images/main/taylor.png"
                                objectFit='contain'
                                layout='fill'
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.faqBlock}>
                    <div className={styles.headerBlockWrap}>
                        <div className={styles.BlocksHeader}>
                            <span className={styles.promoBlocksSubTitle}>
                                second name
                            </span>
                            <span className={styles.promoBlocksTitle}>
                                frequently asked quetions
                            </span>
                        </div>
                    </div>
                    <div className={styles.faqBlockContent}>
                        <div className={styles.faqQuestions}>
                            <div className={styles.questionBlock}>
                                <span className={styles.questionHeader}>
                                    Are all the gambling sites safe?
                                </span>
                                <span className={styles.questionAnswer}>
                                    Unfortunately no, that’s why it’s important to play in licensed bookmarks pages, casino or gambling sites. Licensed gambling sites are regulated by the governing bodies, they take measures to protect the clients and provide them safe and fair experience in gambling online. We monitor every site to have the license, no matter it’s common gambling site or new betting site.
                                </span>
                            </div>
                            <div className={styles.questionBlock}>
                                <span className={styles.questionHeader}>
                                    Is it worth trusting the advice in gambling on the internet?
                                </span>
                                <span className={styles.questionAnswer}>
                                    Hundreds of prognosticators claim that they unlocked the secrets of online wagerings. If the advice is useful, you have to take them with a pinch of salt and use them with your own investigations, for making a bet. Of course a lot of casino games such as slot machines, roulettes, depend on circumstances, regardless of your investigations, you can’t predict football matches. This means, whether you follow the advice about gambling sites or not, you are not guaranteed to win.
                                </span>
                            </div>
                            <div className={styles.questionBlock}>
                                <span className={styles.questionHeader}>
                                    Are there gambling sites that don’t require age verification?
                                </span>
                                <span className={styles.questionAnswer}>
                                    Gambling sites without age verification don’t exist. Age checkout - important and legal part to protect adolescents. Any gambling sites, not requiring the age checkout are illegal. Some bookmakers allow you to make a deposit before verifying your age, yet you can’t get your money back, if you are juvenile.
                                </span>
                            </div>
                            <div className={styles.questionBlock}>
                                <span className={styles.questionHeader}>
                                    How can I join an online gambling site?
                                </span>
                                <span className={styles.questionAnswer}>
                                    Visit your chosen online gambling site, you see a noticeable link or button written “join now” or “register”. Click one of these buttons and you will be represented the form to fill in. you have to enter the personal data, choose the username and password. Then you will be asked to accept the terms and conditions of the site. That’s all. After that your account will be opened and ready to use.
                                </span>
                            </div>
                            <div className={styles.questionBlock}>
                                <span className={styles.questionHeader}>
                                    How to get bonuses and rewards?
                                </span>
                                <span className={styles.questionAnswer}>
                                    This varies from site to site. Some of the bonuses and rewards are given out automatically, that’s why you don’t need to do anything. Sometimes you need to enter the code for adding funds to your account or send email to the support service. Sometimes you have to meet certain requirements and bonus will be accruals after you complete them.
                                </span>
                            </div>
                        </div>
                        <div className={styles.faqPicture}>
                            <Image
                                src="/images/main/Characters.png"
                                objectFit='contain'
                                height={600}
                                width={1000}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.countries}>
                    <div className={styles.BlocksHeader}>
                        <span className={styles.promoBlocksSubTitle}>
                            OVERALL {casinosCount} CASINOS
                        </span>
                        <span className={styles.promoBlocksTitle} style={{ textTransform: "initial" }}>
                            We have casinos in these countries
                        </span>
                    </div>
                    <div className={styles.countriesContent}>
                        {
                            countries.slice(0, 11).map(country => (
                                <div className={styles.country} key={country.id}>
                                    <span className={styles.countryName}>
                                        {country.name}
                                    </span>
                                    <span className={styles.countryCount}>
                                        {country.casinos_has_many_count}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className={styles.optimoText}>
                    <span>
                        <b>Optimobet</b> - this site is comparing online gambling. We were run in november 2020 to be the source of contact advice and recommendations about providers of online gambling.
                    </span>
                    <span>
                        At the time Optimobet.com can be new in the gambling sphere, team, behind him , is not like that. We have the big experience in the industry of online gambling. Our time works hard to provide with necessary information to our users to compare the providers.
                    </span>
                    <span>
                        Optimobet.com is full of objective reviews of hundreds of leading bookmaker pages, casinos and etc. And secrets which open the most difficult moments of the games in sites of online gamblings. We assure that our detailed reviews helps our users to get substantiated decision while choosing the favourite place in online gambling.
                    </span>
                    <span>
                        The most important is that we are sure that our decision of recommending you the best licensed sites means that you can count on a safe and fair environment from the moment of registration. Regardless you are betting on sport or gambling online blackjack.
                    </span>
                    <span>
                        Our commitment to responsible gaming does not finish here. Visit our page in the responsible game to get the additional information how to avoid potential traps during the betting safety on online gambling. So the links of or organisations that offer you all of their efforts against the gambling addiction. And give recommendations to them who worry about their gambling habits.
                    </span>
                </div>

                <div className={styles.aboutSite}>
                    <div className={styles.BlocksHeader}>
                        <span className={styles.promoBlocksSubTitle}>
                            second name
                        </span>
                        <span className={styles.promoBlocksTitle} style={{ textTransform: "initial" }}>
                            How to opt the best site for gambling
                        </span>
                    </div>
                    <div className={styles.aboutSiteContent}>
                        <span>
                            Regardless you are new in gambling on internet or you just want to try new gambling site, you have to take into account some factors
                        </span>
                        <div className={styles.aboutSiteInfo}>
                            <span className={styles.aboutSiteInfoTitle}>
                                License
                            </span>
                            <span>
                                Licenses are non-negotiable, when we talk about online gambling. If you want to bet on football, play online roulette, try poker sites or participate in tournament League of Legends, licensed sites are necessary. Licensed organisations regulate the actions of licenses, to be sure to protect vulnerable clients and encourage the responsible games, provide a safe and fair environment to the gambler for betting.
                            </span>
                        </div>
                        <div className={styles.aboutSiteInfo}>
                            <span className={styles.aboutSiteInfoTitle}>
                                Options for betting
                            </span>
                            <span>
                                Important to bet on your favourite kinds of sports and play favourite games in an online casino on your favourite site, that you choose. Meanwhile some sites represent universal stores due to all your demands in online gambling, others can be specialized at certain markets such as online betting on cybersport or bingo. Some brands are positioning themselves as the sites of online slots. You have to be sure that you have the access to the major functions, like betting during the gambling or live games in casino with dealers
                            </span>
                        </div>
                        <div className={styles.aboutSiteInfo}>
                            <span className={styles.aboutSiteInfoTitle}>
                                Bonus
                            </span>
                            <span>
                                Of course you don’t need to ask for bonuses on online gambling but if you find the suitable one it may raise your bankroll. No matter what you are betting, bonuses are almost for everybody, from free bets to bonuses on appropriate deposits. But you need to do research before you get on board - introduce yourself to conditions and terms of any demands and restrictions for betting - the best bonus does not always mean the best offer.
                            </span>
                        </div>
                        <div className={styles.aboutSiteInfo}>
                            <span className={styles.aboutSiteInfoTitle}>
                                Mobile gamblings
                            </span>
                            <span>
                                Want to get access to the best casino games? Betting on sport or gamblings, then you are on your way! Almost every brand has a site suitable for mobile devices but some of the best sites with games have apps for mobile casino and apps for betting on sports. This lets you play when and where is suitable for you. Access on the apps depends on gambling sites,however most of them are available for devices Android and IOS. of course some gambling sites of mobile devices offer more satisfaction than others. But you will find everything you want in our online casino and bookmakers overviews.
                            </span>
                        </div>
                        <div className={styles.aboutSiteInfo}>
                            <span className={styles.aboutSiteInfoTitle}>
                                Ways of payment
                            </span>
                            <span>
                                You need to deposit money on your game account before you can make a bet with real money it is important to know that on your chosen site there are options of bank operations which are suitable for you. Deposit and withdrawal of funds from debit cards are included in every gambling site. But you may have not such choice, for example if you want to deposit via PayPal or bitcoin
                            </span>
                        </div>
                        <div className={styles.aboutSiteInfo}>
                            <span className={styles.aboutSiteInfoTitle}>
                                Terms and conditions
                            </span>
                            <span>
                                Before you register on one of our best sites of online casinos you have to get acquainted with our conditions. They contain detailed information about bonuses, minimum deposit or maximum limits of funds withdrawal, processing time. Maybe it is not interesting in online gambling, yet very important
                            </span>
                        </div>
                        <div className={styles.aboutSiteInfo}>
                            <span className={styles.aboutSiteInfoTitle}>
                                Options of client support
                            </span>
                            <span>
                                Most of the cases of your experience in online gambling will be smooth and you will have no need to contact the client support. But how can you contact if you have a problem or a question? You can contact every online site via email or contact form. But the best online sites offer support via telephone or chat. Check out options of support before you register.
                            </span>
                            <span>
                                If you can’t choose between two sites, the welcome bonus may overweigh. We opt the key bonus conditions to assist you in comparing bonus offerings on every site. Regardless the site offers free bets or online casino, has non-deposit welcome bonus. It’s important to understand betting demands and minimum coefficient and game limits before you make a bet. If you decide that bonus is suitable for you, then asking it is easier due to our links (get the bonus which will take you directly to the registration page.
                            </span>
                            <span>
                                Every gambling site we recommend is fully licensed and regulated by the gambling authorities. You can be sure regardless you use Optimobet.com for comparing online bookmakers, for comparing online games or for comparing any choice of poker games, you will find a safe and trustable gambling site.
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function NewCasino({ bonus_url, shared_content, features, id, claim_bonus_text, image_source, image_characters, bonus_link, details_link, title }) {
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
                        {title || shared_content?.name}
                    </span>
                    {features?.map(feature => (
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
                        href={bonus_url || bonus_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.bonusButton}
                    >
                        Get Bonus
                    </a>
                    {bonus_url
                        ? <Link href={`/casinos/${id}`}>
                            <a className={styles.detailsButton}>
                                Details
                            </a>
                        </Link>
                        : <a
                            className={styles.detailsButton}
                            href={details_link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Details
                        </a>
                    }
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    // uncomment when it works
    const casinos = await APIRequest('/nolimit/casinos');
    const bonuses = await APIRequest('/nolimit/bonuses');
    const slots = await APIRequest('/nolimit/slots');
    const bookmakers = await APIRequest('/nolimit/bookmakers');
    const countries = await APIRequest('/nolimit/countries');
    const providers = await APIRequest('/nolimit/providers');

    return {
        props: {
            // newCasinos: casinos.data,
            // exclusiveBonus: bonuses.data,
            // freeSlots: slots.data,
            // betting: bookmakers.data,
            casinosCount: casinos.total,
            bonusesCount: bonuses.total,
            slotsCount: slots.total,
            bookmakersCount: bookmakers.total,
            countries: countries,
            providers
        },
        revalidate: 10,
    }
}

Home.withHeader = true;
Home.withFooter = true;