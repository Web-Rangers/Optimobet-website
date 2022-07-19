import styles from '../../styles/pages/SignIn.module.css'
import Image from 'next/image'
import Link from 'next/link'
import TextField from '../../components/TextField'
import PasswordField from '../../components/PasswordField'
import useWindowSize from '../../hooks/useWindowSize'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Language from '../../components/Language'
import { useCookies } from 'react-cookie'
import APIRequest from '../../functions/requests/APIRequest'
import { useRouter } from 'next/router'

export default function Login() {
    const { width, height } = useWindowSize()
    const [imgLeft, setImgLeft] = useState()
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState()

    useEffect(() => {
        setCurrentPage(<SignIn setCurrentPage={setCurrentPage} />)
    }, [])

    useEffect(()=>{
        if (router.query.token) {
            APIRequest("/me", "GET")
                .then(res => {
                    setCookie("token", router.query.token)
                    localStorage.setItem("user", JSON.stringify(res))
                    router.push('/')
                })
                .catch(e => {
                    console.error(e)
                })
        }
    },[router.query])

    useEffect(() => {
        if ((0.4 * width - 520) > 0)
            setImgLeft(null)
        else
            setImgLeft(520)
    }, [width])

    return (
        <>
            <header className={styles.loginHeader} style={imgLeft ? { padding: "16px 15px" } : { padding: `16px ${(0.4 * width - 520) / 2 + 15}px` }}>
                <Link href={'/'}>
                    <a style={{ display: "flex", alignItems: "center" }}>
                        <Image
                            src="/images/logo.svg"
                            alt="logo"
                            width={153}
                            height={36}
                        />
                    </a>
                </Link>
                <div style={{ marginRight: "-24px" }}>
                    <Language />
                </div>
            </header>
            <div className={styles.container}>
                <AnimatePresence>
                    {currentPage}
                </AnimatePresence>
                {width <= 480 && <>
                    <div className={styles.mobileImage}>
                        <Image
                            src="/images/signin/2 – 4.png"
                            width={250}
                            height={140}
                        />
                    </div>
                    <div className={styles.mobileBg} />
                </>
                }
                <div className={styles.picture}>
                    <div className={styles.landscape}>
                        <Image
                            src="/images/signin/Base_Landscape.png"
                            objectFit='cover'
                            layout='fill'
                        />
                    </div>
                    <div className={styles.characters} style={imgLeft ? { left: imgLeft + "px" } : {}}>
                        <Image
                            src="/images/signin/2 – 4.png"
                            objectFit='contain'
                            layout='fill'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

function SignIn({ setCurrentPage }) {
    const [cookie, setCookie] = useCookies("token")
    const router = useRouter()

    function login(e) {
        e.preventDefault()
        const body = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        APIRequest(
            "/login",
            "POST",
            JSON.stringify(body)
        )
            .then(res => {
                setCookie("token", res.token)
                localStorage.setItem("user", JSON.stringify(res))
                router.push('/')
            })
            .catch(e => {
                alert(e)
            })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut" }}
            className={styles.formArea}
        >
            <form className={styles.authForm} onSubmit={login}>
                <span className={styles.formTitle}>
                    Sign In
                </span>
                <span className={styles.formText}>
                    Don't have an account? <a onClick={() => {
                        setCurrentPage(<SignUp setCurrentPage={setCurrentPage} />)
                    }}>
                        Create one
                    </a>
                </span>
                <div className={styles.socials}>
                    <div className={styles.social}>
                        <Image
                            src="/images/icons/socials/Apple.svg"
                            width={24}
                            height={24}
                        />
                    </div>
                    <Link href={"http://backend.luckyrabbits.ge/social/login/facebook"}>
                        <div className={styles.social}>
                            <Image
                                src="/images/icons/socials/facebook.svg"
                                width={24}
                                height={24}
                            />
                        </div>
                    </Link>                    
                    <Link href={"http://backend.luckyrabbits.ge/social/login/google"}>
                        <div className={styles.social}>
                            <Image
                                src="/images/icons/socials/Google.svg"
                                width={24}
                                height={24}
                            />
                        </div>
                    </Link>
                    <div className={styles.social}>
                        <Image
                            src="/images/icons/socials/Twitter.svg"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>
                <div className={styles.separatorOr}>Or</div>
                <TextField
                    required
                    name="email"
                    placeholder="Email"
                    type="email"
                    style={{ marginBottom: "24px" }}
                />
                <PasswordField
                    required
                    name="password"
                    placeholder="Password"
                />
                <div className={styles.buttons}>
                    <span className={styles.formText}>
                        <a
                            onClick={() => {
                                setCurrentPage(<Recovery setCurrentPage={setCurrentPage} />)
                            }}
                        >
                            Forgot Password?
                        </a>
                    </span>
                    <button type='submit' className={styles.submit}>
                        Sign In
                    </button>
                </div>
            </form>
        </motion.div>
    )
}

function SignUp({ setCurrentPage }) {
    const [cookie, setCookie] = useCookies("token")
    const router = useRouter()
    const [passwordCheck, setPasswordCheck] = useState([false, false, false, false])
    const [gender, setGender] = useState()

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

    function register(e) {
        e.preventDefault()
        if (passwordCheck.filter(check => check).length == 4) {
            const body = {
                first_name: e.target.first_name.value, //required
                last_name: e.target.last_name.value, //required
                gender: gender, //required
                country_id: 1, // optional
                email: e.target.email.value, //required
                birthday: e.target.birthday.value, //required|moreThan 18 years old
                password: e.target.password.value, // required
                password_confirmation: e.target.password_confirmation.value, // required
                agree_to_terms: e.target.agree_to_terms.checked
            }
            let troubles = []
            Object.entries(body).forEach(([key, value]) => {
                if (!value)
                    troubles.push(key)
            });
            if (body.password != body.password_confirmation) {
                troubles.push("password confirmation")
            }
            if (troubles.length == 0) {
                APIRequest(
                    "/register",
                    "POST",
                    JSON.stringify(body)
                )
                    .then(res => {
                        setCookie("token", res.token)
                        localStorage.setItem("user", JSON.stringify(res))
                        router.push('/')
                    })
                    .catch(e => {
                        alert(e + (e.errors?.email ? "Current email is exist." : ""))
                    })
            }
            else {
                alert("You should set these fields correctly: " + troubles)
            }
        }
        else {
            alert("Your password is not correct")
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut" }}
            className={styles.formArea}
        >
            <form className={styles.authForm} onSubmit={register}>
                <span className={styles.formTitle}>
                    Sign Up
                </span>
                <span className={styles.formText}>
                    You already have an account? <a onClick={() => {
                        setCurrentPage(<SignIn setCurrentPage={setCurrentPage} />)
                    }}>
                        Sign In
                    </a>
                </span>
                <div className={styles.socials}>
                    <div className={styles.social}>
                        <Image
                            src="/images/icons/socials/Apple.svg"
                            width={24}
                            height={24}
                        />
                    </div>
                    <Link href={"http://backend.luckyrabbits.ge/social/login/facebook"}>
                        <div className={styles.social}>
                            <Image
                                src="/images/icons/socials/facebook.svg"
                                width={24}
                                height={24}
                            />
                        </div>
                    </Link>                    
                    <Link href={"http://backend.luckyrabbits.ge/social/login/google"}>
                        <div className={styles.social}>
                            <Image
                                src="/images/icons/socials/Google.svg"
                                width={24}
                                height={24}
                            />
                        </div>
                    </Link>
                    <div className={styles.social}>
                        <Image
                            src="/images/icons/socials/Twitter.svg"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>
                <div className={styles.separatorOr}>Or</div>
                <div className={styles.fieldsInRow}>
                    <TextField
                        required
                        name="first_name"
                        placeholder="First name"
                        type="text"
                        style={{ marginBottom: "24px" }}
                    />
                    <TextField
                        required
                        name="last_name"
                        placeholder="Last name"
                        type="text"
                        style={{ marginBottom: "24px" }}
                    />
                </div>
                <TextField
                    required
                    name="email"
                    placeholder="Email"
                    type="email"
                    style={{ marginBottom: "24px" }}
                />
                <div className={styles.fieldsInRow}>
                    <TextField
                        required
                        name="birthday"
                        placeholder="Date of birth"
                        type="text"
                        max={
                            (new Date().getFullYear() - 18) + "-" +
                            (((new Date().getMonth() + 1) < 10) ?
                                "0" + (new Date().getMonth() + 1)
                                :
                                (new Date().getMonth() + 1)
                            ) + "-" +
                            ((new Date().getDate()) < 10 ?
                                "0" + (new Date().getDate())
                                :
                                (new Date().getDate())
                            )
                        }
                        style={{ marginBottom: "24px" }}
                        onFocus={(e) => { e.target.type = "date" }}
                    />
                    <div className={styles.genderPicker} style={{ marginBottom: "24px" }}>
                        <span
                            className={`${gender == "M" && styles.selectedGender}`}
                            onClick={() => setGender("M")}
                        >
                            M
                        </span>
                        <span
                            className={`${gender == "F" && styles.selectedGender}`}
                            onClick={() => setGender("F")}
                        >
                            F
                        </span>
                    </div>
                </div>
                <PasswordField
                    required
                    name="password"
                    placeholder="Password"
                    style={{ marginBottom: "24px" }}
                    onChange={checkPassword}
                />
                <PasswordField
                    required
                    name="password_confirmation"
                    placeholder="Password Confirmation"
                />
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
                    <label className={styles.checkTerms}>
                        <input type={'checkbox'} name="agree_to_terms" />
                        <div className={styles.checkBox} />
                        <span htmlFor='termsCheck' className={styles.checkText}>
                            I confirm that I am over 18 years old and I agree with the <Link href="/login"><a>Terms and Conditions and Privacy Policy.</a></Link>
                        </span>
                    </label>
                </div>
                <div className={styles.buttons}>
                    <button type='submit' className={styles.submit}>
                        Sign In
                    </button>
                </div>
            </form>
        </motion.div>
    )
}

function Recovery({ setCurrentPage }) {
    const submitRef = useRef()

    return (
        <div className={styles.formArea} style={{ flexDirection: "column" }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeInOut" }}
                className={styles.goLogin}
            >
                <a
                    className={styles.loginLink}
                    onClick={() => {
                        setCurrentPage(<SignIn setCurrentPage={setCurrentPage} />)
                    }}
                >
                    <Image
                        src="/images/icons/left-arrow-downloaded.svg"
                        width={18}
                        height={18}
                    />
                    Back to Login
                </a>
            </motion.div>
            <form className={styles.authForm}>
                <motion.span
                    initial={{ opacity: 0, translateY: -100 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -100 }}
                    transition={{ ease: "easeInOut" }}
                    className={styles.formTitle}
                >
                    Forgot your password?
                </motion.span>
                <motion.span
                    initial={{ opacity: 0, translateY: -100 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -100 }}
                    transition={{ ease: "easeInOut" }}
                    className={styles.formDescription}
                >
                    Happens to all of us, but we’ll help you reset your password. Enter the email associated with your account, we’ll send you a link to reset password.
                </motion.span>
                <TextField
                    required
                    placeholder="Email"
                    type="email"
                    onChange={(e) => {
                        if (e.target.validity.valid) {
                            submitRef.current.disabled = false
                            submitRef.current.style.backgroundColor = '#7F3FFC'
                        }
                        else {
                            submitRef.current.disabled = true
                            submitRef.current.style.backgroundColor = '#4B445380'
                        }
                    }}
                />
                <div className={styles.buttons}>
                    <motion.button
                        initial={{ background: "#7F3FFC", width: 111, translateY: 71 }}
                        animate={{ background: "#4B445380", width: 196, translateY: 0 }}
                        exit={{ background: "#7F3FFC", width: 111, translateY: 71 }}
                        transition={{ ease: "easeInOut" }}
                        type='submit'
                        className={styles.submit}
                        style={{
                            marginLeft: 'auto',
                            maxHeight: 48,
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                        }}
                        disabled
                        ref={submitRef}
                    >
                        Reset my password
                    </motion.button>
                </div>
            </form>
        </div>
    )
}