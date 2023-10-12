// Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { io } from 'socket.io-client'
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

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQzNTVjMzY4MTExNDM0YWMwMTI0ZDkiLCJpYXQiOjE2OTY1NzE2MDAsImV4cCI6MTY5NjU3NTIwMH0.ZJRaapdl7ZQBtKWnU2Ec8IkzSLXh4qZIB0XguDVJJRU'

    const getData = async () => {
        // const data = await fetch('http://localhost:8000/users', { headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` } } ).then(res => res.json())
        // setUsers(data)
    }

    useEffect( () => {
        getData()
    }, [])


    interface Messages {
        text: string;
    }

    // const [messages, setMessages] = useState<Messages[]>([])
    // const [inputValue, setInputValue] = useState('')
    // const [socket, setSocket] = useState<any>(null)
    // useEffect(() => {
    //     const newSocket = io('http://localhost:8000')
    //     setSocket(newSocket)

    //     newSocket.on('message', message => {
    //         console.log(message)
    //         setMessages(oldMessages => [...oldMessages, message])
    //     })

    //     return () => {
    //         newSocket.disconnect()
    //     }
    // }, [])
    // const handleSendMessage = () => {
    //     socket.emit('message', inputValue)
    //     setInputValue('')
    // }


    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const socket = io('/socket.io'); // Замените на адрес вашего WebSocket сервера
        socket.on('message', (message) => {
          setChatMessages([...chatMessages, message]);
        });

        // Закрыть соединение при размонтировании компонента
        return () => {
          socket.disconnect();
        };
      }, [chatMessages]);

      const sendMessage = () => {
        const socket = io('/socket.io'); // Замените на адрес вашего WebSocket сервера
        const roomId = 'YOUR_ROOM_ID'; // Замените на уникальный ID комнаты
        socket.emit('joinRoom', roomId);
        socket.emit('message', { roomId, message });
        setMessage('');
    };



    return (
        <>
            <Head>
                <title>Chat</title>
            </Head>

            <section>

                <div>
                    <div>
                        {chatMessages.map((msg, index) => (
                            <div key={index}>{msg}</div>
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
