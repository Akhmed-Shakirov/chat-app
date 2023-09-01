// Next
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
// Next

// UI
import Head from 'next/head'
import Link from 'next/link'
import Icon from '../components/Ui/icon'
// UI

// Block
// import Banner from '../components/Common/banner'
// Block

// Pages
export default function Custom404() {
    const { t } = useTranslation()
    const { locale, locales } = useRouter()

    return (
        <>
            <Head>
                <title>404 Page</title>
            </Head>
            <div className='error-404'>
                <h1>404 - Page Not Found</h1>
            </div>
        </>
    )
}
// Pages

// Server i18n
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
})
// Server i18n
