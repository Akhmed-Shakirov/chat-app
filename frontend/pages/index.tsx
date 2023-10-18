// Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import io from 'socket.io-client'
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
        login: string
        name: string
        password: string
        __v?: number
        _id: string
    }

    const [users, setUsers] = useState<User[]>([])

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQzNTVjMzY4MTExNDM0YWMwMTI0ZDkiLCJpYXQiOjE2OTc2MTYyODQsImV4cCI6MTY5NzYxOTg4NH0.h2q0QPfrtJjUYpMKlQwfrNtL_ZYsXcaVR41wm5S1Zm4'
    const [roomId, setRoomId] = useState('652f91e3354a4c6f924d7893');

    const [chatMessages, setChatMessages] = useState<{ id: number; login: string; date: string; message: string }[]>([])
    const [message, setMessage] = useState('')
    
    const getChatMessages = async () => {
        const data = await fetch('http://localhost:8000/messages/' + roomId, { headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` } } ).then(res => res.json())
        setChatMessages(data?.chats?.length ? data?.chats : [])
    }

    useEffect(() => {
        getChatMessages()
    }, [])


    useEffect(() => {
        const socket = io('http://localhost:8001', {
            transports: ['websocket']
        })

        socket.emit('joinRoom', roomId);
        socket.on('message', (newMessage) => {
            if (typeof newMessage === 'boolean') {
                getChatMessages()
            } else {
                setChatMessages(arr => [...arr, newMessage]);
            }
        })

        return () => {
            socket.off('message')
            socket.disconnect()
        }
    }, [roomId])


    const sendMessage = () => {
        const socket = io('http://localhost:8001', {
            transports: ['websocket']
        })

        const messageData = {
            roomId,
            message,
            login: 'Alex'
        }

        socket.emit('message', messageData)
        setMessage('')
    };



    return (
        <>
            <Head>
                <title>Chat</title>
            </Head>

            <section>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Id chat..."
                />

                <br />

                <div>
                    <div>
                        {chatMessages.map((msg) => (
                            <pre key={msg?.id}>{msg?.message}</pre>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                    />
                    <button onClick={sendMessage}>Отправить</button>
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
