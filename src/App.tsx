import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage, HomePage } from './pages'
import api from './api'
import { IUser } from './types/user'
import * as SocketIO from 'socket.io-client'

export const UserContext = React.createContext<IUser | null>(null)

const socket = SocketIO.connect('http://localhost:3001', { transports: ['websocket', 'polling'], autoConnect: false })

const App = (): React.ReactElement => {
  const [user, setUser] = React.useState<IUser | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {

    api.get('/auth/login-check')
      .then(() => {
        api.get('/user/get-me')
          .then(response => {
            setUser(response.data)
            setIsLoading(false)
          })
      })
      .catch(() => {
        return setIsLoading(false)
      })
  }, [])

  return (
    <UserContext.Provider value={user}>
      {!user && <Navigate to='/auth' />}
      <div className='wrapper'>
        {
          isLoading ?
            <div></div> :
            <Routes>
              <Route path='/auth' element={<AuthPage setUser={setUser} />} />
              <Route path='/' element={<HomePage socket={socket} />} />
            </Routes>
        }
      </div>
    </UserContext.Provider>
  )
}

export default App