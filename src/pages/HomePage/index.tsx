import React from 'react'
import { Chat, Footer, Header, Months } from '../../components'
import * as SocketIO from 'socket.io-client'

export const ClientsContext = React.createContext<number>(0)

const HomePage = ({ socket }: { socket: SocketIO.Socket }): React.ReactElement => {
  const [clientsCount, setClientsCount] = React.useState<number>(0)

  React.useEffect(() => {
    socket.connect()
    socket.on('connected', clientsCount => {
      setClientsCount(clientsCount)
    })

    socket.on('disconnected', clientsCount => {
      setClientsCount(clientsCount)
    })
  }, [])

  return (
    <ClientsContext.Provider value={clientsCount}>
      <div className='home'>
        <div className="container">
          <div className='home__inner'>
            <Header />
            <Months />
            <Chat socket={socket} />
            <Footer />
          </div>
        </div>
      </div>
    </ClientsContext.Provider>
  )
}

export default HomePage