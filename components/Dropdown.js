import styles from '../styles/components/Dropdown.module.css'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import debounce from '../functions/debounce'

export default function Dropdown({ items = [], description, onChange, defaultSelected, bordered = true, searchable = false }) {
    const [current, setCurrent] = useState(items[0])
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef()
    const [filteredItems, setFilteredItems] = useState(items)

    const selectItem = (item) => {
        setCurrent(item)
        onChange && onChange(item)
        setOpen(false)
    }

    const closeIfNotDropdown = (e) => {
        if ((e.target != dropdownRef.current) && (!dropdownRef.current.contains(e.target)))
            setOpen(false)
    }

    function handleSearch(e) {
        const searchString = e.target.value;
        if (searchString.length == 0) {
            setFilteredItems(items)
            return
        }
        const options = {
            includeScore: true,
            keys: ['value'],
            threshold: 0.3,
        }
        const fuse = new Fuse(items, options)
        const result = fuse.search(searchString)
        setFilteredItems(result.map(res => res.item))
    }

    useEffect(() => {
        defaultSelected && setCurrent(items.find(item => item.id === defaultSelected))
    }, [items])

    useEffect(() => {
        if (window)
            window.addEventListener('click', closeIfNotDropdown)
        return () => {
            window.removeEventListener('click', closeIfNotDropdown)
        }
    }, [])

    return (
        <div className={`${styles.container} ${!bordered && styles.noBorder}`} ref={dropdownRef}>
            <div
                className={styles.header}
                onClick={() => setOpen(!open)}
                style={open ? { borderRadius: "30px 30px 0px 0px" } : { borderRadius: "30px" }}
            >
                <div className={styles.icon}>
                    <Image
                        src={`${process.env.IMAGE_URL}/${current?.icon}`}
                        width={27}
                        height={20}
                    />
                </div>
                <div className={styles.textInfo}>
                    {description &&
                        <span className={styles.description}>
                            {description}
                        </span>
                    }
                    <span className={styles.selected}>
                        {current?.value || ""}
                    </span>
                </div>
                <div className={styles.tick} />
            </div>
            <div
                className={styles.itemsContainer}
                style={open ? { height: "auto", border: "1px solid #4B445333", borderTop: "none" } : { height: "0px" }}
            >
                <div className={styles.itemsWrap}>
                    {searchable &&
                        <div className={styles.search}>
                            <input
                                type="text"
                                placeholder="Search your country"
                                onChange={debounce(handleSearch, 1000)}
                            />
                        </div>
                    }
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className={styles.item}
                            onClick={() => selectItem(item)}
                        >
                            <div className={styles.icon}>
                                <Image
                                    src={`${process.env.IMAGE_URL}/${item.icon}`}
                                    width={27}
                                    height={20}
                                    objectFit="contain"
                                />
                            </div>
                            <span className={styles.itemText}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}