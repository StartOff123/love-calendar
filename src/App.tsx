import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage, HomePage } from './pages'
import api from './api'
import { IUser } from './types/user'
import * as SocketIO from 'socket.io-client'

export const UserContext = React.createContext<IUser | null>(null)

const socket = SocketIO.connect(String(process.env.REACT_APP_SERVER_URL), { transports: ['websocket', 'polling'], autoConnect: false })

const App = (): React.ReactElement => {
  const [user, setUser] = React.useState<IUser | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    setIsLoading(true)
    api.get('/auth/login-check')
      .then(response => {
        setUser(response.data)
        setIsLoading(false)
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
            <div className='wrapper__loading'>
              <svg style={{ margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto' }} width="214px" height="214px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <g transform="translate(50 50)">
                  <path fill="#f76c6c" transform="scale(1)" d="M40.7-34.3c-9.8-9.8-25.6-9.8-35.4,0L0-29l-5.3-5.3c-9.8-9.8-25.6-9.8-35.4,0l0,0c-9.8,9.8-9.8,25.6,0,35.4l5.3,5.3L-23,18.7l23,23l23-23L35.4,6.3L40.7,1C50.4-8.8,50.4-24.6,40.7-34.3z">
                    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;0.05;0.39;0.45;0.6;1" values="0.85;1;0.75;0.9;0.85;0.8" calcMode="spline" keySplines="0.215 0.61,0.355 1;0.215 0.61,0.355 1;0.215 0.61,0.355 1;0.215 0.61,0.355 1;0.215 0.61,0.355 1" />
                  </path>
                </g>
              </svg>
            </div> :
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