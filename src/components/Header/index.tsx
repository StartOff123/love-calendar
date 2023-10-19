import React from 'react'
import { UserContext } from '../../App'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

import '../../styles/header.scss'

const Header = (): React.ReactElement => {
  const user = React.useContext(UserContext)

  const handleLogout = () => {
    window.localStorage.removeItem('access_token')
    window.location.reload()
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={handleLogout}>
          <p>Выйти</p>
        </div>
      ),
      icon: <LogoutOutlined />,
      danger: true
    },
  ]

  return (
    <div className='header'>
      <div className='header__title'>
        <img src="/assets/icon/heartHeader.png" alt="" />
        <h1>Love Calendar</h1>
      </div>
      <Dropdown
        trigger={['click']}
        menu={{
          items: items
        }}
      >
        <div className='header__profile'>

          <p>{user?.name}</p>
          <div className='header__profile--img'>
            <img
              src={user?.AvatarUrl ? `${process.env.REACT_APP_SERVER_URL}/uploads/${user?.AvatarUrl}` : '/assets/static/no-avatar.png'}
              alt="Avatar"
            />
          </div>
        </div>
      </Dropdown>
    </div>
  )
}

export default Header