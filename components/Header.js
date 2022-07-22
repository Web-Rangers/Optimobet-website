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
import useWindowSize from '../hooks/useWindowSize'

const links = [
    {
        href: '/casinos',
        name: 'Online Casinos'
    },
    {
        href: '/bonuses',
        name: 'Bonuses'
    },
    {
        href: '/bookmakers',
        name: 'Bookmakers'
    },
    {
        href: '/slots',
        name: 'Free games'
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

export default function Header() {
    const { width, height } = useWindowSize()
    const [bordered, setBordered] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuItems, setMenuItems] = useState();
    const user = useUserInfo();

    useEffect(() => {
        APIRequest('/menu', 'GET')
            .then(res => {
                setMenuItems(res);
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <header className={`${styles.container} ${bordered && styles.bordered}`}>
            {width > 768 && <Link href={'/'}>
                <a className={styles.logo}>
                    <Image
                        src="/images/logo.svg"
                        alt="logo"
                        width={153}
                        height={36}
                    />
                </a>
            </Link>}
            {width > 1024 ?
                <nav className={styles.navigation}>
                    {
                        !menuItems
                            ? links.map((link, index) => (
                                <MenuLink key={link.name} {...link} />
                            ))
                            : menuItems.map((link, index) => (
                                <MenuDropLink
                                    key={link.name}
                                    onClick={() => setBordered(!bordered)}
                                    {...link}
                                />
                            ))
                    }
                </nav>
                :
                <div
                    className={styles.hideMenuBtn}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Image
                        src="/images/icons/menu.svg"
                        width={24}
                        height={24}
                    />
                    Menu
                </div>
            }
            {
                <motion.div
                    className={styles.expandedMenu}
                    animate={isMenuOpen ? { height: "auto" } : { height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <div className={styles.expandedMenuNav}>
                        {width <= 768 &&
                            <div>
                                <MenuLink href={"/"} name={"Home"} key={"Home"} />
                            </div>
                        }
                        {
                            links.map(({ href, name }) => (
                                <div onClick={() => setIsMenuOpen(!isMenuOpen)} key={name}>
                                    <MenuLink href={href} name={name} key={name} />
                                </div>
                            ))
                        }
                    </div>
                </motion.div>
            }
            <Search setBorder={setBordered} />
            <div className={styles.btnsRight}>
                <Language setBorder={setBordered} />
                {
                    !user?.first_name
                        ? <Link href="/login">
                            <a className={styles.login}>
                                Sign In
                            </a>
                        </Link>
                        : <UserMenu user={user} setBorder={setBordered} />
                }
            </div>
        </header>
    )
}

function MenuLink({ href, name }) {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const _isActive = router.pathname.split('/').includes(href.split('/')[1]);
        if (href != "/")
            setIsActive(_isActive);
        if (href == "/" && router.asPath == "/")
            setIsActive(true);
    }, [router.pathname])

    return (
        <Link href={href}>
            <a className={`${styles.link} ${isActive && styles.active}`}>
                {name}
            </a>
        </Link>
    )
}

function MenuDropLink({ name, children, type, onClick }) {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const blockRef = useRef(null);
    const href = getLinkByType(type);

    const dropdownVariants = {
        open: {
            opacity: [0, 1],
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        closed: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    }

    useEffect(() => {
        const _isActive = router.pathname.split('/').includes(href.split('/')[1]);
        if (href != "/")
            setIsActive(_isActive);
        if (href == "/" && router.asPath == "/")
            setIsActive(true);
    }, [router.pathname])

    function getLinkByType(type) {
        return types.find(item => item.name == type)?.href || "/";
    }

    function toggle() {
        setIsOpen(!isOpen);
        onClick && onClick();
    }

    function composeLink(url, type) {
        const params = new URLSearchParams(url.split('?')[1]);
        return `${getLinkByType(type)}?${params.toString()}`;
    }

    return (
        <div
            className={styles.navItem}
            onClick={toggle}
        >
            <a className={`${styles.link} ${isActive && styles.active}`}>
                {name}
            </a>
            <AnimatePresence initial={false}>
                {isOpen && <motion.div
                    variants={dropdownVariants}
                    animate="open"
                    exit="closed"
                    className={styles.dropdown}
                    ref={blockRef}
                >
                    {
                        children.map(child => (
                            <div className={styles.dropdownList} key={child.name} >
                                <span className={styles.dropdownTitle} >
                                    {child.name}
                                </span>
                                <div className={styles.dropdownListChildren}>
                                    {
                                        child.children.map(child => (
                                            <Link href={composeLink(child.url, child.type)} key={child.name}>
                                                <a onClick={toggle}>
                                                    {child.name}
                                                </a>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </motion.div>}
            </AnimatePresence>
        </div >
    )
}

function UserMenu({ user, setBorder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [cookie, setCookie, removeCookie] = useCookies(['token']);
    const router = useRouter();
    const blockRef = useRef()

    function handleLogout() {
        localStorage.removeItem('user');
        removeCookie('token');
        router.reload()
    }

    function toggleOpen() {
        setIsOpen(!isOpen);
        setBorder(!isOpen);
    }

    useEffect(() => {
        if (window)
            window.addEventListener('click', closeIfNotDropdown)
        return () => {
            window.removeEventListener('click', closeIfNotDropdown)
        }
    }, [])

    const closeIfNotDropdown = (e) => {
        if ((e.target != blockRef.current) && (!blockRef.current.contains(e.target)))
            setIsOpen(false)
    }

    return (
        <>
            <div className={styles.user} ref={blockRef}>
                <div
                    onClick={toggleOpen}
                    className={styles.userAvatar}
                >
                    {user.first_name?.slice(0, 1).toUpperCase()}{user.last_name?.slice(0, 1).toUpperCase()}
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
                                <span className={styles.userName}>
                                    {user.first_name} {user.last_name}
                                </span>
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
            <div className={styles.modalImage}>
                <Image
                    src="/images/edit-user-bg.png"
                    alt="edit profile"
                    layout='fill'
                    objectFit='cover'
                />
            </div>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
                <span className={styles.modalFormTitle}> Edit Information </span>
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
            <div className={styles.modalImage}>
                <Image
                    src="/images/edit-password-bg.png"
                    alt="edit profile"
                    layout='fill'
                    objectFit='cover'
                />
                <div className={styles.modalImageOverlap}>
                    <Image
                        src="/images/phoenix.png"
                        height={367}
                        width={230}
                        alt="phoenix"
                    />
                </div>
            </div>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
                <span className={styles.modalFormTitle}> Change Password </span>
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