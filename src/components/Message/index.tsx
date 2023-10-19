import React from 'react'
import classNames from 'classnames'
import { UserContext } from '../../App'
import moment from 'moment'
import 'moment/locale/ru'
import { IMessage } from '../../types/message'
import { Check, CheckAll } from 'react-bootstrap-icons'
import { useInView } from 'react-intersection-observer'

import '../../styles/message.scss'

const Message = ({ id, content, createdAt, userId, socket, viewed, setNotViewsMmessageCount }: IMessage & { setNotViewsMmessageCount: React.Dispatch<React.SetStateAction<number>> }): React.ReactElement => {
    moment.locale('ru')
    const user = React.useContext(UserContext)
    const [viewedMessage, setviewedMessage] = React.useState<boolean>(viewed)

    const { ref, inView } = useInView({
        threshold: 0
    })

    React.useEffect(() => {
        if (user?.id !== userId && !viewedMessage) {
            setNotViewsMmessageCount(state => state + 1)
        }
    }, [])

    React.useEffect(() => {
        const sendViewMessage = (message: IMessage) => {
            if (id === message.id) {
                setviewedMessage(message.viewed)
            }
        }

        socket?.on('sendViewMessage', sendViewMessage)

        return () => {
            socket?.off('sendViewMessage', sendViewMessage)
        }
    }, [socket])

    React.useEffect(() => {
        if (user?.id !== userId && !viewed && inView) {
            socket?.emit('viewMessage', id)
            setNotViewsMmessageCount(state => state - 1)
        }
    }, [inView])

    return (
        <div
            ref={ref}
            className={classNames(
                'message',
                user?.id === userId ? 'message-me' : 'message-him'
            )}
        >
            <div className='message__item'>
                <p>{content}</p>
                <span>{moment(createdAt).format('LT')}</span>
                {user?.id === userId ?
                    viewedMessage ? <CheckAll width={20} hanging={20} /> : <Check width={20} hanging={20} /> : ''
                }
            </div>
        </div>
    )
}

export default Message