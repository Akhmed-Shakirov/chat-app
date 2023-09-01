// Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import io from 'socket.io-client';
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
export default function IndexPage() {
    const { t } = useTranslation()
    const { locale, locales } = useRouter()

    interface User {
        login: string;
        name: string;
        password: string;
        __v?: number;
        _id: string;
    }

    const [users, setUsers] = useState<User[]>([])

    const getData = async () => {
        const data = await fetch('http://localhost:8000/users').then(res => res.json())
        setUsers(data)
    }

    useEffect( () => {
        getData()
    }, [])

    interface Messages {
        text: string;
    }


    const [messages, setMessages] = useState<Messages[]>([])
    const [inputValue, setInputValue] = useState('')
    const [socket, setSocket] = useState<any>(null)

    useEffect(() => {
        const newSocket = io('http://localhost:8000')
        setSocket(newSocket)

        newSocket.on('message', message => {
            console.log(message)
            setMessages(oldMessages => [...oldMessages, message])
        })

        return () => {
            newSocket.disconnect()
        }
    }, [])

    const handleSendMessage = () => {
        socket.emit('message', inputValue)
        setInputValue('')
    }

    return (
        <>
            <Head>
                <title>Chat</title>
            </Head>

            <section>

                <div>
                    {messages.map((message, index) => (
                        <div key={index}>{message.text}</div>
                    ))}
                </div>
                <div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={event => setInputValue(event.target.value)}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>

            </section>
        </>
    )
}
// Pages

// Server i18n
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
})
// Server i18n
