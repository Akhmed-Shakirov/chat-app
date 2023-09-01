import '@/styles/globals.scss'
import '@/styles/style.scss'
import '@/styles/icons.scss'
import '@/styles/ui.scss'

import Layout from '../components/layout'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'


const inter = Inter({ subsets: ['latin'] })

const App = ({ Component, pageProps }: AppProps) => {

    const router = useRouter()

    useEffect(() => {
        const handleRouteChangeComplete = () => {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual'
            }
        }

        router.events.on('routeChangeComplete', handleRouteChangeComplete)

        return () => {
            router.events.off('routeChangeComplete', handleRouteChangeComplete)
        }
    }, [])


    return (
        <Layout>
            <Head>
                <title>CRUD react</title>
            </Head>
            <Component {...pageProps} />
        </Layout>
    )
}

export default appWithTranslation(App)
