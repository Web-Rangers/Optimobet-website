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
        name: 'Gambling'
    },
    {
        href: '/complaints',
        name: 'Complaints'
    },
    {
        href: '/blog',
        name: 'Blog'
    },
]

export default function Header() {
    const [bordered, setBordered] = useState(false)
    const user = useUserInfo();

    return (
        <header className={`${styles.container} ${bordered && styles.bordered}`}>
            <Link href={'/'}>
                <a className={styles.logo}>
                    <Image
                        src="/images/logo.svg"
                        alt="logo"
                        width={153}
                        height={36}
                    />
                </a>
            </Link>
            <nav className={styles.navigation}>
                {
                    links.map(link => (
                        <MenuLink key={link.name} {...link} />
                    ))
                }
            </nav>
            <Search setBorder={setBordered} />
            <Language setBorder={setBordered} />
            {
                !user
                    ? <Link href="/login">
                        <a className={styles.login}>
                            Sign In
                        </a>
                    </Link>
                    : <UserMenu user={user} setBorder={setBordered} />
            }
        </header>
    )
}

function MenuLink({ href, name }) {
    const router = useRouter();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const _isActive = router.pathname.split('/').includes(href.split('/')[1]);
        setIsActive(_isActive);
    }, [router.pathname])

    return (
        <Link href={href}>
            <a className={`${styles.link} ${isActive && styles.active}`}>
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
                    {user.first_name.slice(0, 1).toUpperCase()}{user.last_name.slice(0, 1).toUpperCase()}
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
                                <Link href={'/favorite-games'}>
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
                                </Link>
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
            {editModal && <EditModal user={user} onClose={() => setEditModal(false)} />}
            {passwordModal && <PasswordModal onClose={() => setPasswordModal(false)} />}
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

    return <div className={styles.modal}>
        <div className={styles.modalBody}>
            <div
                onClick={onClose}
                className={styles.close}
            >
                ✕
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
                    <input type="text" name='first_name' defaultValue={user.first_name} />
                    <input type="text" name='last_name' defaultValue={user.last_name} />
                </div>
                <input type="text" name='email' defaultValue={user.email} />
                <input type="date" name='birthday' defaultValue={user.birthday} />
                <Dropdown
                    defaultSelected={user.country_id}
                    items={countries?.map(country => ({ id: country.id, value: country.name }))}
                    onChange={(item) => country_id.current = item.id}
                />
                <input type='submit' value='Save Information' />
            </form>
        </div>
    </div>
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

    return <div className={styles.modal}>
        <div className={styles.modalBody}>
            <div
                onClick={onClose}
                className={styles.close}
            >
                ✕
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
    </div>
}