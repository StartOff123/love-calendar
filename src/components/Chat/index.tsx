import React from 'react'
import { FloatButton } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import * as SocketIO from 'socket.io-client'
import ChatInner from '../ChatInner'

import '../../styles/chat.scss'

const Chat = ({ socket }: { socket: SocketIO.Socket }): React.ReactElement => {
    const [showChat, setShowChat] = React.useState<boolean>(false)
    const [notViewsMmessageCount, setNotViewsMmessageCount] = React.useState<number>(0)

    showChat ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'scroll'

    React.useEffect(() => {
        if (notViewsMmessageCount < 0) {
            setNotViewsMmessageCount(0)
        }
    }, [notViewsMmessageCount])

    return (
        <div className='chat'>
            <FloatButton
                badge={{
                    count: notViewsMmessageCount
                }}
                onClick={() => setShowChat(!showChat)}
                icon={<CommentOutlined />}
                className='char__floatBtn'
            />
            <div className={classNames(
                'chat__wrapper',
                showChat ? 'chat__wrapper-show' : ''
            )}>
                <ChatInner socket={socket} setShow={setShowChat} show={showChat} setNotViewsMmessageCount={setNotViewsMmessageCount}/>
            </div>
        </div>
    )
}

export default Chat