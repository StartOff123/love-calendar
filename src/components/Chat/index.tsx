import React from 'react'
import { FloatButton, Badge, Input, Empty } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import api from '../../api'
import Message from '../Message'
import { UserContext } from '../../App'
import { ClientsContext } from '../../pages/HomePage'
import * as SocketIO from 'socket.io-client'
import { IMessage } from '../../types/message'

import '../../styles/chat.scss'
import ChatForm from '../ChatForm'

interface IUserChat {
    id: number
    name: string
    online: boolean
}

const Chat = ({ socket }: { socket: SocketIO.Socket }): React.ReactElement => {
    const clientsCount = React.useContext(ClientsContext)
    const user = React.useContext(UserContext)

    const loveDiv = React.useRef<HTMLDivElement>(null)
    const messgesRef = React.useRef<HTMLDivElement>(null)

    const [showChat, setShowChat] = React.useState<boolean>(false)
    const [userChat, setUserChat] = React.useState<IUserChat | null>(null)
    const [messages, setMessages] = React.useState<IMessage[] | []>([])

    showChat ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'scroll'
    messgesRef.current?.scrollBy(0, messgesRef.current.scrollHeight + 50)

    const handleClickHeart = () => socket.emit('clickHeart')

    React.useEffect(() => {
        if (user) {
            api.get(`/user/get-user/${user.id === 1 ? 2 : 1}`)
                .then(response => {
                    setUserChat(response.data)
                })
        }

        socket.on('click', () => {
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
        })

        socket.on('recMessage', data => {
            setMessages(state => [...state, data])
        })

        api.get('/chat/get')
            .then(respoonse => {
                setMessages(respoonse.data)
            })
    }, [])

    React.useEffect(() => {
        if (messages.at(-1)?.userId === user?.id) {
            messgesRef.current?.scrollBy(0, messgesRef.current.scrollHeight + 50)
        }
    }, [messages])

    return (
        <div className='chat'>
            <FloatButton
                onClick={() => setShowChat(!showChat)}
                icon={<CommentOutlined />}
                className='char__floatBtn'
            />
            <div className={classNames(
                'chat__wrapper',
                showChat ? 'chat__wrapper-show' : ''
            )}>
                <div className='chat__wrapper--header'>
                    <button className='chat__wrapper--header-btn' onClick={() => setShowChat(!showChat)}>Закрыть</button>
                    <div ref={loveDiv} className='chat__wrapper--header-love'>
                        <img className='chat__wrapper--header-love-icon' src="/assets/icon/heartHeader.png" alt="icon" onClick={handleClickHeart} />
                    </div>
                    <p>{userChat?.name}</p>
                    {clientsCount > 1 ?
                        <Badge className='chat__wrapper--header-online' dot={true} color='#42ff64'>
                            <div className='chat__wrapper--header-img'>
                                <img src="/assets/static/no-avatar.png" alt="" />
                            </div>
                        </Badge>

                        :
                        <div className='chat__wrapper--header-img'>
                            <img src="/assets/static/no-avatar.png" alt="" />
                        </div>
                    }
                </div>
                <div ref={messgesRef} className='chat__wrapper--messages' style={{ height: window.innerHeight - 200 }}>
                    {messages.length > 0 ? messages.map(message =>
                        <Message
                            key={message.id}
                            id={message.id}
                            content={message.content}
                            createdAt={message.createdAt}
                            userId={message.userId}
                        />
                    ) :
                        <Empty
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                            description='Пусто'
                            image={
                                <svg width="60" height="60" fill="rgb(255, 170, 196)" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l3.235 1.94a2.76 2.76 0 0 0-.233 1.027L1 7.384v5.733l3.479-2.087c.15.275.335.553.558.83l-4.002 2.402A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738l-4.002-2.401c.223-.278.408-.556.558-.831L15 13.117V7.383l-3.002 1.801a2.76 2.76 0 0 0-.233-1.026L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM7.06.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2ZM8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" />
                                </svg>
                            }
                        />
                    }
                </div>
                <ChatForm socket={socket} />
            </div>
        </div>
    )
}

export default Chat