import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useRef } from 'react'
import styles from '../styles/components/Header.module.css'
import Language from '../components/Language'
import Search from '../components/Search'
import useUserInfo from '../hooks/useUserInfo'
import { AnimatePresence, motion } from 'framer-motion'
import Dropdown from './Dropdown'
import APIRequest from '../functions/requests/APIRequest'
import { useCookies } from 'react-cookie'
import PasswordField from './PasswordField'
import TextField from './TextField'
import { ReactSVG } from 'react-svg'

const links = [
    {
        href: '/casinos',
        name: 'Online Casinos',
        svg: 'casinos',
        page: 1
    },
    {
        href: '/bonuses',
        name: 'Bonuses',
        svg: 'bonuses',
        page: 2
    },
    {
        href: '/bookmakers',
        name: 'Bookmakers',
        svg: 'bookmakers',
        page: 3
    },
    {
        href: '/slots',
        name: 'Free games',
        svg: 'slots',
        page: 4
    },
    // {
    //     href: '/complaints',
    //     name: 'Complaints'
    // },
    // {
    //     href: '/blog',
    //     name: 'Blog'
    // },
]

const types = [
    {
        name: 'casino',
        href: '/casinos'
    },
    {
        name: 'bonus',
        href: '/bonuses'
    },
    {
        name: 'bookmaker',
        href: '/bookmakers'
    },
    {
        name: 'slot',
        href: '/slots'
    },
]

function getLinkByType(type) {
    return types.find(item => item.name == type)?.href || "/";
}

function composeLink(url, type) {
    const params = new URLSearchParams(url.split('?')[1]);
    return `${getLinkByType(type)}?${params.toString()}`;
}

export default function MobileHeader() {
    const [bordered, setBordered] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const user = useUserInfo()
    const [menuPage, setMenuPage] = useState(1)
    const [menuItems, setMenuItems] = useState()
    const router = useRouter()

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
    }, [isMenuOpen])

    useEffect(() => {
        if (router.asPath && (router.asPath != '/')) {
            // console.log(menuItems, menuItems?.filter(link => router.asPath.includes(link.url))[0])
            // setMenuPage(menuItems?.filter(link => router.asPath.includes(link.url))[0]?.page)
        }
        setIsMenuOpen(false)
    }, [router,menuItems])

    useEffect(() => {
        APIRequest('/menu', 'GET')
            .then(res => {
                setMenuItems(res)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <header className={`${styles.container} ${bordered && styles.bordered}`}>
            <div className={styles.backHeader} />
            <AnimatePresence initial={false} exitBeforeEnter>
                <motion.div
                    className={styles.menuHeader}
                    key={isMenuOpen ? "menuShow" : "menuHide"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    {
                        isMenuOpen ?
                            <>
                                <div
                                    className={styles.burgerMenuButton}
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    <Image src="/images/icons/close.svg" width={32} height={32} />
                                </div>
                                <Link href="/">
                                    <a className={styles.logo} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                        <Image src="/images/logo.svg" width={153} height={36} />
                                    </a>
                                </Link>
                                <div className={styles.mobileLanguage}>
                                    <Language />
                                </div>
                            </>
                            :
                            <>
                                <div
                                    className={styles.burgerMenuButton}
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    <Image src="/images/icons/menu.svg" width={32} height={32} />
                                </div>
                                <Search setBorder={setBordered} />
                                {
                                    !user?.first_name
                                        ? <Link href="/login">
                                            <a style={{ display: "flex" }}>
                                                <Image src="/images/icons/user.svg" width={28} height={28} objectFit="contain" />
                                            </a>
                                        </Link>
                                        : <UserMenu user={user} setBorder={setBordered} />
                                }
                            </>
                    }
                </motion.div>
            </AnimatePresence>
            <AnimatePresence initial={false}>
                {
                    isMenuOpen && <motion.div
                        className={styles.burgerMenu}
                        animate={{ top: ['-100vh', '0vh'] }}
                        exit={{ top: ['0vh', '-100vh'] }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className={styles.pagesNav}>
                            {
                                menuItems?.map((section, index) => (
                                    <div
                                        className={
                                            `${styles.pageIcon} 
                                            ${((index + 1) == menuPage) && styles.activePage}`
                                            // ${(page==3 && page==menuPage) && styles.activePageFix3} 
                                            // ${(page==4 && page==menuPage) && styles.activePageFix4}`
                                        }
                                        onClick={() => {
                                            setMenuPage(index + 1)
                                        }}
                                        key={`a_${index}`}
                                    >
                                        <ReactSVG
                                            src={`/images/icons/header/${section.image}.svg`}
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                        <AnimatePresence initial={false} exitBeforeEnter>
                            <motion.div
                                className={styles.menuNavigation}
                                key={menuPage-1}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                {menuItems[menuPage - 1]?.type ?
                                    <Link href={menuItems[menuPage - 1]?.type}>
                                        <a
                                            className={styles.mainLink}
                                            rel='noopener noreferrer'
                                        >
                                            {menuItems[menuPage - 1]?.name}
                                        </a>
                                    </Link>
                                    :
                                    <a
                                        className={styles.mainLink}
                                        rel='noopener noreferrer'
                                    >
                                        {menuItems[menuPage - 1]?.name}
                                    </a>
                                }
                                {
                                    menuItems[menuPage - 1]?.children.map(
                                        links => (
                                            <>
                                                <span className={styles.sectionName}>
                                                    {links.name}
                                                </span>
                                                {links.children.map(
                                                    (link, index) => (
                                                        <Link href={composeLink(link.url, link.type)} key={`b_${link.name}`} >
                                                            <a
                                                                className={styles.queryLink}
                                                                rel='noopener noreferrer'
                                                                key={`b_${link.name}`}
                                                            >
                                                                {link.name}
                                                            </a>
                                                        </Link>
                                                    )
                                                )}
                                            </>
                                        )
                                    )
                                }
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                }
            </AnimatePresence>
        </header>
    )
}

function MenuLink({ href, name, svg }) {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const _isActive = router.pathname.split('/').includes(href.split('/')[1]);
        setIsActive(_isActive);
    }, [router.pathname])

    return (
        <Link href={href}>
            <a className={`${styles.link} ${styles.mobiLink} ${isActive && styles.active}`}>
                <ReactSVG
                    src={`/images/icons/header/${svg}.svg`}
                    width={24}
                    height={24}
                />
                {name}
            </a>
        </Link>
    )
}

function UserMenu({ user, setBorder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [cookie, setCookie, removeCookie] = useCookies(['token']);
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem('user');
        removeCookie('token');
        router.reload()
    }

    function toggleOpen() {
        setIsOpen(!isOpen);
        setBorder(!isOpen);
    }

    return (
        <>
            <div className={styles.user}>
                <div
                    onClick={toggleOpen}
                    className={styles.userAvatar}
                >
                    <Image src="/images/icons/user.svg" width={32} height={32} />
                </div>
                <AnimatePresence initial={false}>
                    {
                        isOpen && (
                            <motion.div
                                animate={{ opacity: [0, 1] }}
                                exit={{ opacity: [1, 0] }}
                                transition={{ duration: 0.3 }}
                                className={styles.userMenu}
                            >
                                <div className={styles.userInfo}>
                                    <div className={styles.userAvatar}>
                                        {user.first_name.slice(0, 1).toUpperCase()}{user.last_name.slice(0, 1).toUpperCase()}
                                    </div>
                                    <span className={styles.userName}>
                                        {user.first_name} {user.last_name}
                                    </span>
                                </div>
                                {/* <Link href={'/favorite-games'}>
                                    <a className={styles.userMenuItem}>
                                        <div>
                                            <Image
                                                src={'/images/icons/play-card.svg'}
                                                alt="play-card"
                                                width={24}
                                                height={24}
                                            />
                                            <span>
                                                Favorite games
                                            </span>
                                        </div>
                                        <span className={styles.userMenuCounter}>
                                            {user.favoriteGamesCount ?? 0}
                                        </span>
                                    </a>
                                </Link> */}
                                <Link href={'/my-complaints'}>
                                    <a className={styles.userMenuItem}>
                                        <div>
                                            <Image
                                                src={'/images/icons/message-report.svg'}
                                                alt="message-report"
                                                width={24}
                                                height={24}
                                            />
                                            <span>
                                                My complaints
                                            </span>
                                        </div>
                                        <span className={styles.userMenuCounter}>
                                            {user.complaintsCount ?? 0}
                                        </span>
                                    </a>
                                </Link>
                                <div className={styles.divider} />
                                <span
                                    onClick={() => setEditModal(true)}
                                    className={styles.userMenuItem}
                                >
                                    <div>
                                        <Image
                                            src={'/images/icons/user-circle.svg'}
                                            alt="user circle"
                                            width={24}
                                            height={24}
                                        />
                                        <span>
                                            Edit Information
                                        </span>
                                    </div>
                                </span>
                                <span
                                    onClick={() => setPasswordModal(true)}
                                    className={styles.userMenuItem}
                                >
                                    <div>
                                        <Image
                                            src={'/images/icons/lock.svg'}
                                            alt="lock"
                                            width={24}
                                            height={24}
                                        />
                                        <span>
                                            Change Password
                                        </span>
                                    </div>
                                </span>
                                <span
                                    onClick={handleLogout}
                                    className={styles.userMenuItem}
                                >
                                    <div>
                                        <Image
                                            src={'/images/icons/logout.svg'}
                                            alt="logout"
                                            width={24}
                                            height={24}
                                        />
                                        <span>
                                            Log Out
                                        </span>
                                    </div>
                                </span>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
            <AnimatePresence initial={false}>
                {editModal && <EditModal user={user} onClose={() => setEditModal(false)} />}
                {passwordModal && <PasswordModal onClose={() => setPasswordModal(false)} />}
            </AnimatePresence>
        </>
    )
}

function EditModal({ user, onClose }) {
    const [countries, setCountries] = useState();
    const country_id = useRef(user.country_id);
    const [cookie] = useCookies(['token']);

    useEffect(() => {
        APIRequest('/countries', 'GET')
            .then(res => setCountries(res))
            .catch(err => console.log(err))
    }, [])

    function handleSubmit(e) {
        e.preventDefault();
        const { first_name, last_name, email, birthday } = Object.fromEntries(new FormData(e.target));
        const body = {
            first_name,
            last_name,
            country_id: country_id.current,
            email,
            birthday
        };
        APIRequest(`/user`, 'POST', JSON.stringify(body), cookie['token'])
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res));
                onClose();
            })
            .catch(err => alert(err))
    }

    return <motion.div
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 0.3 }}
        className={styles.modal}
    >
        <div className={styles.modalBody}>
            <div className={styles.modalHeader}>
                <span className={styles.modalFormTitle}> Edit Information </span>
                <div
                    onClick={onClose}
                    className={styles.close}
                >
                    <Image
                        src={'/images/icons/close.svg'}
                        alt="close"
                        width={24}
                        height={24}
                    />
                </div>
            </div>
            <div className={styles.modalImage}>
                <Image
                    src="/images/edit-user-bg.png"
                    alt="edit profile"
                    layout='fill'
                    objectFit='cover'
                />
            </div>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
                <div className={styles.modalFormRow}>
                    <TextField label="First name" type="text" name='first_name' defaultValue={user.first_name} />
                    <TextField label="Last Name" type="text" name='last_name' defaultValue={user.last_name} />
                </div>
                <TextField label="E-mail" type="text" name='email' defaultValue={user.email} />
                <TextField label="Date of birth " type="date" name='birthday' defaultValue={user.birthday} />
                <Dropdown
                    description="Country"
                    defaultSelected={user.country_id}
                    items={countries?.map(country => ({ id: country.id, value: country.name }))}
                    onChange={(item) => country_id.current = item.id}
                />
                <input type='submit' value='Save Information' />
            </form>
        </div>
    </motion.div>
}

function PasswordModal({ onClose }) {
    const [cookie] = useCookies(['token']);
    const [passwordCheck, setPasswordCheck] = useState([false, false, false, false])

    function checkPassword(e) {
        setPasswordCheck([
            e.target.value?.length >= 12,

            e.target.value?.split("")
                .filter(letter => (
                    isNaN(letter * 1)
                    &&
                    letter.toLowerCase() != letter.toUpperCase()
                    &&
                    letter == letter.toUpperCase()
                ))
                .length > 0,

            e.target.value?.split("")
                .filter(letter => !isNaN(letter * 1))
                .length > 0,

            e.target.value?.split("")
                .filter(letter => (
                    isNaN(letter * 1)
                    &&
                    letter.toLowerCase() == letter.toUpperCase()
                ))
                .length > 0
        ])
    }

    function handleSubmit(e) {
        e.preventDefault();
        const {
            new_password,
            new_password_confirmation
        } = Object.fromEntries(new FormData(e.target));
        const body = {
            password: new_password,
            password_confirmation: new_password_confirmation
        };
        APIRequest(`/password`, 'POST', JSON.stringify(body), cookie['token'])
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res));
                onClose();
            })
            .catch(err => alert(err))
    }

    return <motion.div
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 0.3 }}
        className={styles.modal}
    >
        <div className={styles.modalBody}>
            <div className={styles.modalHeader}>
                <span className={styles.modalFormTitle}> Change Password </span>
                <div
                    onClick={onClose}
                    className={styles.close}
                >
                    <Image
                        src={'/images/icons/close.svg'}
                        alt="close"
                        width={24}
                        height={24}
                    />
                </div>
            </div>
            <div className={styles.modalImage}>
                <Image
                    src="/images/edit-password-bg.png"
                    alt="edit profile"
                    layout='fill'
                    objectFit='cover'
                />
                <div className={styles.modalImageOverlap}>
                    <Image
                        src="/images/Phoenix.png"
                        height={165}
                        width={104}
                        alt="phoenix"
                    />
                </div>
            </div>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
                <span className={styles.modalFormSubtitle}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                <PasswordField type="password" name='password' placeholder='Old password' />
                <PasswordField type="password" onChange={checkPassword} name='new_password' placeholder='New password' />
                <PasswordField type="password" name='new_password_confirmation' placeholder='Repeat password' />
                <div className={styles.passwordDescription}>
                    <span className={styles.passwordTitle}>
                        Your password must:
                    </span>
                    <span
                        className={`
                            ${styles.checkOption} 
                            ${passwordCheck[0] && styles.active}
                        `}
                    >
                        Be at least 12 characters
                    </span>
                    <span
                        className={`
                            ${styles.checkOption} 
                            ${passwordCheck[1] && styles.active}
                        `}
                    >
                        Include at least one uppercase letter
                    </span>
                    <span
                        className={`
                            ${styles.checkOption} 
                            ${passwordCheck[2] && styles.active}
                        `}
                    >
                        Include at least one number
                    </span>
                    <span
                        className={`
                            ${styles.checkOption} 
                            ${passwordCheck[3] && styles.active}
                        `}
                    >
                        Include at least one symbol
                    </span>
                    <input type='submit' value='Save' />

                </div>
            </form>
        </div>
    </motion.div>
}