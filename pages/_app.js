import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/globals.css'
import { CookiesProvider } from 'react-cookie';
import useWindowSize from '../hooks/useWindowSize';
import MobileHeader from '../components/MobileHeader';
import Head from 'next/head'
import Script from 'next/script';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    const { width } = useWindowSize();
    const withHeader = Component.withHeader || false;
    const withFooter = Component.withFooter || false;

    useEffect(() => {
        Storage.prototype.setItem = new Proxy(Storage.prototype.setItem, {
            apply(target, thisArg, argumentList) {
                const event = new CustomEvent('localstorage', {
                    detail: {
                        key: argumentList[0],
                        oldValue: thisArg.getItem(argumentList[0]),
                        newValue: argumentList[1],
                    },
                });
                window.dispatchEvent(event);
                return Reflect.apply(target, thisArg, argumentList);
            },
        });
    }, [])

    return (
        <CookiesProvider>
            {withHeader && (width <= 480 ? <MobileHeader /> : <Header />)}
            <div style={{ paddingTop: withHeader ? 86 : 0 }}>
                <Component {...pageProps} />
            </div>
            {withFooter && <Footer />}
        </CookiesProvider>
    )

}

export default MyApp
