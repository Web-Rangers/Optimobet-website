import { useState } from 'react'
import styles from "../../styles/components/casino/BonusBlock.module.css"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence } from 'framer-motion'
import TermsModal from '../TermsModal'

export default function BonusBlock({
    maximum_bet,
    minimal_deposit,
    name,
    wagering_requirements,
    value_per_spin,
    maximum_cashout,
    bonus_expiration,
    url,
    claim_bonus_url,
    bonus_url,
    terms_and_condition
}) {
    const [modal, setModal] = useState(false)

    return (
        <div className={styles.bonusBlock}>
            <div className={styles.bonusData}>
                <span className={styles.bonusTitle}>
                    {name}
                </span>
                <div className={styles.bonusOptions}>
                    <div className={styles.optionsColumn}>
                        <div className={styles.option}>
                            <span className={styles.optionTitle}>
                                Minimal Deposit
                            </span>
                            <span className={styles.optionData}>
                                {minimal_deposit}
                            </span>
                        </div>
                        <div className={styles.option}>
                            <span className={styles.optionTitle}>
                                Maximum Bet
                            </span>
                            <span className={styles.optionData}>
                                {maximum_bet}
                            </span>
                        </div>
                    </div>
                    <div className={styles.optionsColumn}>
                        <div className={styles.option}>
                            <span className={styles.optionTitle}>
                                Value per spin
                            </span>
                            <span className={styles.optionData}>
                                {value_per_spin}
                            </span>
                        </div>
                        <div className={styles.option}>
                            <span className={styles.optionTitle}>
                                Maximum Cashout
                            </span>
                            <span className={styles.optionData}>
                                {maximum_cashout}
                            </span>
                        </div>
                    </div>
                    <div className={styles.optionsColumn}>
                        <div className={styles.option}>
                            <span className={styles.optionTitle}>
                                Wagering
                            </span>
                            <span className={styles.optionData}>
                                {wagering_requirements}
                            </span>
                        </div>
                        <div className={styles.option}>
                            <span className={styles.optionTitle}>
                                Bonus expiration
                            </span>
                            <span className={styles.optionData}>
                                {bonus_expiration}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.getBonusArea}>
                <a 
                    target="_blank"
                    className={styles.getBonusButton}
                    style={{marginTop:"38px"}}
                    href={claim_bonus_url || bonus_url || url}
                >
                    Get Bonus
                </a>
                <span 
                    className={styles.tcButton}
                    onClick={() => {
                        setModal(!modal)
                    }}
                >
                    {terms_and_condition && 
                        <AnimatePresence>
                            {modal && 
                                <TermsModal
                                    setModalState={setModal}
                                    rules={terms_and_condition}
                                />
                            }                                
                        </AnimatePresence>
                    }
                    T&C Apply
                </span>
            </div>
        </div>
    )
}