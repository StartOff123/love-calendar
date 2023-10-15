import axios from 'axios'

axios.defaults.withCredentials = true

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
})

export default instance