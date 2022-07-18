import { ReactSVG } from 'react-svg'
import { useEffect, useState } from 'react'
import styles from '/styles/components/Stars.module.css'
import useWindowSize from '../hooks/useWindowSize'

export default function Stars({ points = 0 }) {
    const [pointsS, setPoinstS] = useState(points)
    const { width } = useWindowSize()

    useEffect(() => {
        setPoinstS(points)
    }, [points])

    return (
        <>
            <ReactSVG
                src='/images/icons/star.svg'
                className={`${styles.star} ${pointsS >= 0.5 && styles.activeStar}`}
            />
            {width > 480 && <>
                <ReactSVG
                    src='/images/icons/star.svg'
                    className={`${styles.star} ${pointsS >= 1.5 && styles.activeStar}`}
                />
                <ReactSVG
                    src='/images/icons/star.svg'
                    className={`${styles.star} ${pointsS >= 2.5 && styles.activeStar}`}
                />
                <ReactSVG
                    src='/images/icons/star.svg'
                    className={`${styles.star} ${pointsS >= 3.5 && styles.activeStar}`}
                />
                <ReactSVG
                    src='/images/icons/star.svg'
                    className={`${styles.star} ${pointsS >= 4.5 && styles.activeStar}`}
                />
            </>
            }
            <span className={styles.points}>
                {pointsS}
            </span>
        </>
    )
}