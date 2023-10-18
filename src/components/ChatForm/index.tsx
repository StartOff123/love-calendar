import React from 'react'
import * as SocketIO from 'socket.io-client'
import { useFormik } from 'formik'
import { UserContext } from '../../App'
import { Input } from 'antd'

const ChatForm = ({ socket }: { socket: SocketIO.Socket }) => {
  const user = React.useContext(UserContext)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      message: ''
    },
    onSubmit: value => {
      if (user) {
        socket.emit('sendMessage', { content: value.message, userId: user?.id })
        formik.resetForm()
      }
    }
  })

  const onKeyEvent = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      if (formik.values.message !== '') {
        formik.handleSubmit()
        e.preventDefault()
      }
    } else if (e.keyCode === 13 && e.shiftKey) {
      formik.setFieldValue('message', formik.values.message + '\r\n')
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className='chat__wrapper--footer'>
      <Input.TextArea
        name='message'
        onPressEnter={e => e.preventDefault()}
        onKeyDown={e => onKeyEvent(e)}
        value={formik.values.message}
        onChange={formik.handleChange}
        autoSize
        style={{ maxHeight: 100 }}
        className='chat__wrapper--footer-input'
        placeholder='Сообщение...'
      />
      <button type='submit' disabled={formik.values.message === ''} className='chat__wrapper--footer-btn'>
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 14 14" width="16">
          <path clipRule="evenodd" d="M1.866 5.02C1.94941 5.23071 2.07991 5.41955 2.24752 5.57207C2.41512 5.72459 2.61539 5.83677 2.833 5.9L7.619 7L2.878 8.039C2.65537 8.09993 2.44995 8.21177 2.27796 8.36571C2.10598 8.51965 1.97213 8.71146 1.887 8.926L0.749001 12.9C0.686737 13.0542 0.674058 13.2239 0.71273 13.3856C0.751401 13.5474 0.839499 13.693 0.964776 13.8023C1.09005 13.9117 1.24628 13.9792 1.41174 13.9957C1.5772 14.0121 1.74367 13.9766 1.888 13.894L12.9 7.7C13.025 7.63082 13.1293 7.52941 13.2018 7.4063C13.2744 7.2832 13.3127 7.14291 13.3127 7C13.3127 6.8571 13.2744 6.7168 13.2018 6.5937C13.1293 6.4706 13.025 6.36919 12.9 6.3L1.888 0.106004C1.74367 0.0234468 1.5772 -0.0120868 1.41174 0.00434315C1.24628 0.0207732 1.09005 0.0883503 0.964776 0.197679C0.839499 0.307007 0.751401 0.452654 0.71273 0.614368C0.674058 0.776082 0.686737 0.945828 0.749001 1.1L1.866 5.02Z" fill="#fff" fillRule="evenodd" />
        </svg>
      </button>
    </form>
  )
}

export default ChatForm