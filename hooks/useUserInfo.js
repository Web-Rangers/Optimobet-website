import React, { useEffect, useState } from 'react'

export default function useUserInfo() {
    const [info, setInfo] = useState()

    useEffect(() => {
        const onStorage = () => {
            const userData = localStorage.getItem('user')
            if (userData) {
                setInfo(JSON.parse(userData))
            }
        };

        window.addEventListener('localstorage', onStorage);

        const userData = localStorage.getItem('user')
        if (userData) {
            setInfo(JSON.parse(userData))
        }

        return () => {
            window.removeEventListener('localstorage', onStorage);
        };
    }, []);

    return info
}
