import React from 'react'
import { UserContext } from '../../App'

import '../../styles/header.scss'

const Header = (): React.ReactElement => {
  const user = React.useContext(UserContext)

  return (
    <div className='header'>
      <div className='header__title'>
        <img src="/assets/icon/heartHeader.png" alt="" />
        <h1>Love Calendar</h1>
      </div>
      <div className='header__profile'>
        <p>{user?.name}</p>
        <div className='header__profile--img'>
          <img
            src={user?.AvatarUrl ? `${process.env.REACT_APP_SERVER_URL}/uploads/${user?.AvatarUrl}` : '/assets/static/no-avatar.png'}
            alt="Avatar"
          />
        </div>
      </div>
    </div>
  )
}

export default Header