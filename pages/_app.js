import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/globals.css'
import { CookiesProvider } from 'react-cookie';
import useWindowSize from '../hooks/useWindowSize';
import MobileHeader from '../components/MobileHeader';

function MyApp({ Component, pageProps }) {
    const { width } = useWindowSize();
    const withHeader = Component.withHeader || false;
    const withFooter = Component.withFooter || false;

    return (
        <CookiesProvider>
            {withHeader && (width <= 430 ? <MobileHeader /> : <Header />)}
            <div style={{ paddingTop: withHeader ? 86 : 0 }}>
                <Component {...pageProps} />
            </div>
            {withFooter && <Footer />}
        </CookiesProvider>
    )

}

export default MyApp
