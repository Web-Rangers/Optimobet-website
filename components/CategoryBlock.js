import styles from '/styles/components/CategoryBlock.module.css'
import Image from 'next/image'
import Link from 'next/link'
import useWindowSize from '../hooks/useWindowSize'
import { useEffect, useState } from 'react'

export default function CategoryBlock({ name, info, image, bgColor = "", href = "/" }) {
    const { width } = useWindowSize()
    const [widthIcon, setWidthIcon] = useState(140)

    useEffect(()=>{
        let iconsize = 180
        if (width<=1440)
            iconsize = 140
        if (width<=1024)
            iconsize = 120
        setWidthIcon(iconsize)
    },[width])

    return (
        <Link href={href}>
            <a className={styles.categoryBlock}>
                <div className={styles.ImgWithRound} style={{ background: bgColor }}>
                    <Image
                        src={image}
                        objectFit='contain'
                        width={widthIcon}
                        height={widthIcon}
                    />
                </div>
                <div className={styles.categoryInfo}>
                    <span className={styles.categoryTitle}>
                        {name}
                    </span>
                    <span className={styles.categoryDescription}>
                        {info}
                    </span>
                </div>
            </a>
        </Link>
    )
}