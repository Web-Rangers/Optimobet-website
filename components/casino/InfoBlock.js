import styles from "../../styles/components/casino/InfoBlock.module.css"
import Image from "next/image"

export default function infoBlock({ iconSrc, infoTitle, infoText, dataText, dataImages }) {

    return (
        <div className={styles.infoBlock}>
            <div className={styles.infoBlockLeft}>
                <div className={styles.infoIcon}>
                    <Image
                        src={iconSrc}
                        layout='fill'
                    />
                </div>
                <div className={styles.infoText}>
                    <span className={styles.infoTitle}>
                        {infoTitle}
                    </span>
                    <span>
                        {infoText}
                    </span>
                </div>
            </div>
            <div className={styles.infoData}>
                {dataText}
                {dataImages && dataImages.length>0 && dataImages.map(img => (
                    <Image
                        src={img}
                        width={27}
                        height={20}
                    />
                ))}                
            </div>
        </div>
    )
}