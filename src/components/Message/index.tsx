import React from 'react'
import classNames from 'classnames'
import { UserContext } from '../../App'
import moment from 'moment'
import 'moment/locale/ru'
import { IMessage } from '../../types/message'

import '../../styles/message.scss'

const Message = ({ content, createdAt, userId }: IMessage): React.ReactElement => {
    moment.locale('ru')
    const user = React.useContext(UserContext)

    return (
        <div className={classNames(
            'message',
            user?.id === userId ? 'message-me' : 'message-him'
        )}>
            <div className='message__item'>
                <p>{content}</p>
            </div>
            <span>{moment(createdAt).format('L LT')}</span>
        </div>
    )
}

export default Message