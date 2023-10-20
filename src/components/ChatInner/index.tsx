import React from 'react'
import { Empty, FloatButton } from 'antd'
import moment from 'moment'
import ChatForm from '../ChatForm'
import Message from '../Message'
import * as SocketIO from 'socket.io-client'
import { IMessage } from '../../types/message'
import { ClientsContext } from '../../pages/HomePage'
import debounce from 'lodash.debounce'
import classNames from 'classnames'
import { UserContext } from '../../App'
import api from '../../api'
import { CloseOutlined, DownOutlined } from '@ant-design/icons'

import '../../styles/chat.scss'

interface IUserChat {
    id: number
    name: string
    lastOnline: string
}

function useWindowSize() {
    const [size, setSize] = React.useState([0, 0])
    React.useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight])
        }
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [])
    return size
}

moment.locale('ru')
const ChatInner = ({ socket, show, setShow, setNotViewsMmessageCount, notViewsMmessageCount }: {
    socket: SocketIO.Socket,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    show: boolean,
    setNotViewsMmessageCount: React.Dispatch<React.SetStateAction<number>>
    notViewsMmessageCount: number
}): React.ReactElement => {
    const size = useWindowSize()
    const user = React.useContext(UserContext)
    const clientsCount = React.useContext(ClientsContext)
    const messagesRef = React.useRef<HTMLDivElement>(null)
    const loveDiv = React.useRef<HTMLDivElement>(null)

    const [userChat, setUserChat] = React.useState<IUserChat | null>(null)
    const [messages, setMessages] = React.useState<IMessage[] | []>([])
    const [isTypnig, setIsTyping] = React.useState<boolean>(false)
    const [visibDownBtn, setVisibDownBtn] = React.useState<boolean>(false)

    const handleClickHeart = () => socket.emit('clickHeart')
    const debounceTyping = debounce(() => setIsTyping(false), 500)

    messagesRef.current?.addEventListener('scroll', () => {
        if (messagesRef.current && messagesRef.current?.scrollTop < messagesRef.current?.scrollHeight - messagesRef.current?.clientHeight - 150) {
            !visibDownBtn && setVisibDownBtn(true)
        } else {
            visibDownBtn && setVisibDownBtn(false)
        }
    })

    const handleScrollDownChat = () => {
        messagesRef.current?.scrollTo({
            top: messagesRef.current?.scrollHeight,
            left: 0,
            behavior: 'smooth'
        })
    }

    React.useEffect(() => {
        if (user) {
            api.get(`/user/get-user/${user.id === 1 ? 2 : 1}`)
                .then(response => {
                    setUserChat(response.data)
                })
            api.get('/chat/get')
                .then(respoonse => {
                    setMessages(respoonse.data)
                })
        }
    }, [])

    React.useEffect(() => {
        if (messages.length != 0) {
            if (messages[messages.length - 1].userId === user?.id) {
                messagesRef.current?.scrollTo({
                    top: messagesRef.current?.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                })
            } else if (messagesRef.current && messagesRef.current?.scrollTop + messagesRef.current?.clientHeight + 8 === messagesRef.current?.children.item(1)?.clientHeight) {
                messagesRef.current?.scrollTo({
                    top: messagesRef.current?.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                })
            }
        }
    }, [messages])

    React.useEffect(() => {
        const recMessageEvent = (message: IMessage) => {
            setMessages(state => [...state, message])
        }

        function sendOfflineEvent(value: IUserChat) {
            setUserChat(value)
        }

        const animateHeartEvent = () => {
            const animationNode = document.createElement('img')
            const id = String(Math.floor(Math.random() * 100))
            animationNode.classList.add('chat__wrapper--header-love-animate')
            animationNode.setAttribute('src', '/assets/static/clickHeart.gif')
            animationNode.setAttribute('id', id)
            loveDiv.current?.appendChild(animationNode)

            setTimeout(() => {
                const img: HTMLImageElement = document.getElementById(id) as HTMLImageElement
                loveDiv.current?.removeChild(img)
            }, 2000)
        }

        const sendTypingEvent = () => {
            setIsTyping(true)
            debounceTyping()
        }

        socket.on('sendOffline', sendOfflineEvent)
        socket.on('sendTyping', sendTypingEvent)
        socket.on('click', animateHeartEvent)
        socket.on('recMessage', recMessageEvent)

        return () => {
            socket.off('sendOffline', sendOfflineEvent)
            socket.off('sendTyping', sendTypingEvent)
            socket.off('click', animateHeartEvent)
            socket.off('recMessage', recMessageEvent)
        }
    }, [socket])

    React.useEffect(() => {
        messagesRef.current?.scrollBy(0, messagesRef.current?.scrollHeight)
    }, [show, size])

    return (
        <>
            <div className='chat__wrapper--header'>
                <button className='chat__wrapper--header-btn' style={(size[0] < 500) ? { padding: 10 } : {}} onClick={() => setShow(!show)}>{size[0] < 500 ? <CloseOutlined color='#fff' /> : 'Закрыть'}</button>
                <div ref={loveDiv} className='chat__wrapper--header-love'>
                    <img className='chat__wrapper--header-love-icon' src="/assets/icon/heartHeader.png" alt="icon" onClick={handleClickHeart} />
                </div>
                <div className='chat__wrapper--header-user'>
                    <div>
                        <p>{userChat?.name}</p>
                    </div>
                    {isTypnig ?
                        <div className='chat__wrapper--header-user-typing'>
                            <p>печатает</p>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div> :
                        <span className='chat__wrapper--header-user-stats'>{clientsCount > 1 ? 'В сети' : 'был(а) в сети ' + moment(userChat?.lastOnline).fromNow()}</span>
                    }
                </div>
            </div>
            <div ref={messagesRef} className='chat__wrapper--messages' style={{ height: size[1] - 200 }}>
                <FloatButton
                    badge={{
                        count: notViewsMmessageCount,
                        color: 'rgb(255, 170, 196)'
                    }}
                    onClick={handleScrollDownChat}
                    icon={<DownOutlined />}
                    className={classNames(
                        'chat__wrapper--floatBtn',
                        visibDownBtn && 'chat__wrapper--floatBtn-visib'
                    )}
                />
                <div>
                    {messages.length > 0 ? messages.map((message) =>
                        <Message
                            key={message.id}
                            id={message.id}
                            content={message.content}
                            createdAt={message.createdAt}
                            userId={message.userId}
                            viewed={message.viewed}
                            socket={socket}
                            setNotViewsMmessageCount={setNotViewsMmessageCount}
                        />
                    ) :
                        <Empty
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                            description='Пусто'
                            image={
                                <svg width="60" height="60" fill="rgb(255, 170, 196)" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l3.235 1.94a2.76 2.76 0 0 0-.233 1.027L1 7.384v5.733l3.479-2.087c.15.275.335.553.558.83l-4.002 2.402A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738l-4.002-2.401c.223-.278.408-.556.558-.831L15 13.117V7.383l-3.002 1.801a2.76 2.76 0 0 0-.233-1.026L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM7.06.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2ZM8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" />
                                </svg>
                            }
                        />
                    }
                </div>
            </div>
            <ChatForm socket={socket} messagesRef={messagesRef} />
        </>
    )
}

export default ChatInner