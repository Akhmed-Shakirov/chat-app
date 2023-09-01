import Head from 'next/head'

export default function Layout({ children }: any) {
    return (
        <>
            <Head>
                <meta name="description" content="Wisk Telecom Solution" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.svg" />
            </Head>
            <main translate="no">
                {children}
            </main>
        </>
    )
}
